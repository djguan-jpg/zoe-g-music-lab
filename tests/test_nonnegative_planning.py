# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Original decimal sign is checked before binary64 storyboard decisions."""
import copy
import json
import subprocess
import unittest
from pathlib import Path
from musiclab.common import number, nonnegative_number, is_negative_number
from musiclab.application import build
from musiclab.storyboard_timing_review import review, markdown

ROOT = Path(__file__).resolve().parents[1]
NEGATIVE = ['-1e-999', '-0.0000001e-999', '-1_0e-9_9_9', ' \u0085-１２e-９９９\u0085 ', '-١e-٩٩٩', '-𝟙e-𝟡𝟡𝟡', '-0.0001', -1]
ZERO = ['-0', '-0.0e-999', '-０_０e-９９９', '-٠e-٩٩٩', '-𝟘e-𝟡𝟡𝟡', '+1e-999', '1e-999', 0, -0.0]

def fixture(value):
    brief=json.loads((ROOT/'examples/first-light-mv.json').read_text(encoding='utf-8'))
    brief['shots'][0]['start']=value
    return brief

def panel(value):
    return {'fields':{'mv-duration':'1','mv-fps':'24'},'shots':[{'start':str(value),'end':'1'}]}

class NonnegativePlanningTests(unittest.TestCase):
    def test_original_nonzero_negative_mantissa_rejects_before_float_underflow(self):
        for value in NEGATIVE:
            with self.subTest(value=value):
                self.assertTrue(is_negative_number(value,'時間'))
                with self.assertRaisesRegex(ValueError,'非負'):nonnegative_number(value,'時間')
                # Signed callers of number retain their existing conversion.
                self.assertLessEqual(number(value,'數值'),0)

    def test_genuine_signed_zero_positive_underflow_and_unicode_grammar_remain(self):
        for value in ZERO:self.assertEqual(nonnegative_number(value,'時間'),0);self.assertFalse(is_negative_number(value,'時間'))
        for value in [' \u0085１２.５\u0085 ', '١_٢.٥', '𝟙_𝟚.𝟝', '+12.5e+0']:
            self.assertEqual(nonnegative_number(value,'時間'),12.5)
        for value in ['',True,None,'NaN','Infinity','0x0','-1__0e-999','\ufeff0','\x1c0']:
            with self.assertRaises(ValueError):nonnegative_number(value,'時間')

    def test_complete_legacy_and_modern_storyboard_reject_without_mutating_brief(self):
        for value in NEGATIVE:
            for modern in (False,True):
                b=fixture(value)
                if not modern:b.pop('motifs')
                before=copy.deepcopy(b)
                with self.assertRaisesRegex(ValueError,'非負'):build('storyboard',b)
                self.assertEqual(b,before)
        for value in ZERO:
            b=fixture(value);before=copy.deepcopy(b);r=build('storyboard',b)
            self.assertEqual(r.data['shots'][0]['start'],0);self.assertEqual(b,before)

    def test_partial_review_classifies_original_negative_endpoints_and_retains_source(self):
        for value in NEGATIVE:
            for field in ('start','end'):
                p=panel(0);p['shots'][0][field]=str(value);before=copy.deepcopy(p)
                r=review({'panel':p})
                self.assertEqual(r['issue_count'],1);self.assertEqual(r['timed_shots'],0)
                self.assertEqual((r['issues'][0]['row'],r['issues'][0]['field'],r['issues'][0]['code']),(1,field,'invalid_range'))
                self.assertEqual(r['source'],before);self.assertEqual(p,before)
        for value in ZERO:self.assertEqual(review({'panel':panel(value)})['issue_count'],0)

    def test_real_python_js_whole_reports_and_mantissa_matrix_agree(self):
        values=[*NEGATIVE,*ZERO,'12.5','１２.５','1_2.5','',True,None,'NaN','-1__0e-999','\ufeff0']
        cases=[panel(v) for v in [*NEGATIVE,*ZERO]]
        for v in NEGATIVE:
            p=panel(0);p['shots'][0]['end']=str(v);cases.append(p)
        code="const fs=require('node:fs'),V=require('./web/planning-values.js'),T=require('./web/storyboard-timing.js');const x=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify({numbers:x.values.map(v=>{try{return {ok:true,value:V.nonnegativeNumber(v),negative:V.isNegative(v)}}catch{return {ok:false}}}),reports:x.panels.map(p=>{const data=T.report(p);return {data,markdown:T.markdown(data)}})}));"
        p=subprocess.run(['node','-e',code],input=json.dumps({'values':values,'panels':cases},ensure_ascii=False),cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr);actual=json.loads(p.stdout)
        expected=[]
        for value in values:
            try:expected.append({'ok':True,'value':nonnegative_number(value,'時間'),'negative':is_negative_number(value,'時間')})
            except ValueError:expected.append({'ok':False})
        self.assertEqual(actual['numbers'],expected)
        self.assertEqual(actual['reports'],[{'data':review({'panel':p}),'markdown':markdown(review({'panel':p}))} for p in cases])
