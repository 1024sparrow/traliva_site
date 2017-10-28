#!/bin/bash

#tab_id=root
tab_id=$2
content_style_path=$1/$2/content_style.css
pp=$1/$2

sed "s/++++/\/static\/tabs\/${tab_id}\//g" ${pp}/tab_style.css >> ${pp}/style.css

echo -n > ${content_style_path}.tmp
echo "#-*- coding: utf-8 -*-" >> ${content_style_path}.tmp
echo "import sys, re" >> ${content_style_path}.tmp
echo "if len(sys.argv) == 1:" >> ${content_style_path}.tmp
echo "    p_prefix = ''" >> ${content_style_path}.tmp
echo "else:" >> ${content_style_path}.tmp
echo "    p_prefix = sys.argv[1]" >> ${content_style_path}.tmp
echo "a = ''" >> ${content_style_path}.tmp
echo "for line in sys.stdin.readlines():" >> ${content_style_path}.tmp
echo "    a += line.replace('\n', '')" >> ${content_style_path}.tmp
echo "a = re.sub(re.compile(\"/\*.*?\*/\",re.DOTALL ) ,\"\" ,a)" >> ${content_style_path}.tmp
echo "a = re.sub(re.compile(\"\s*{\s*\",re.DOTALL ) ,\"{\" ,a)" >> ${content_style_path}.tmp
echo "a = re.sub(re.compile(\"\s*}\s*\",re.DOTALL ) ,\"}\" ,a)" >> ${content_style_path}.tmp
echo "a = re.sub(re.compile(\"\s*;\s*\",re.DOTALL ) ,\";\" ,a)" >> ${content_style_path}.tmp
echo "a = re.sub(re.compile(\"\s*:\s*\",re.DOTALL ) ,\":\" ,a)" >> ${content_style_path}.tmp
echo "a = re.sub(re.compile(\"\s*,\s*\",re.DOTALL ) ,\",\" ,a)" >> ${content_style_path}.tmp
echo "b = ''" >> ${content_style_path}.tmp
echo "tmp_in = ''" >> ${content_style_path}.tmp
echo "tmp_out = ''" >> ${content_style_path}.tmp
echo "inbrackets = False" >> ${content_style_path}.tmp
echo "for index in range(0, len(a)):" >> ${content_style_path}.tmp
echo "    i = a[index]" >> ${content_style_path}.tmp
echo "    if i == '{':" >> ${content_style_path}.tmp
echo "        inbrackets = True" >> ${content_style_path}.tmp
echo "        b += p_prefix + tmp_out" >> ${content_style_path}.tmp
echo "        tmp_out = ''" >> ${content_style_path}.tmp
echo "    if inbrackets:" >> ${content_style_path}.tmp
echo "        tmp_in += i" >> ${content_style_path}.tmp
echo "    else:" >> ${content_style_path}.tmp
echo "        if i == ',':" >> ${content_style_path}.tmp
echo "            tmp_out += ',' + p_prefix" >> ${content_style_path}.tmp
echo "        else:" >> ${content_style_path}.tmp
echo "            tmp_out += i" >> ${content_style_path}.tmp
echo "    if i == '}':" >> ${content_style_path}.tmp
echo "        inbrackets = False" >> ${content_style_path}.tmp
echo "        b += tmp_in" >> ${content_style_path}.tmp
echo "        tmp_in = ''" >> ${content_style_path}.tmp
echo "print b" >> ${content_style_path}.tmp
sed "s/++++/\/static\/tabs\/${tab_id}\/text\//g" ${content_style_path} | python ${content_style_path}.tmp '.text ' >> ${pp}/style.css
rm ${content_style_path}.tmp
