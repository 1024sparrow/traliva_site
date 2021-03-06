#!/bin/bash
# Сжимает передаваемый параметром CSS-файл. А если вторым параметром указывается id, то в CSS ко всем условиям приписывается вхождение в элемент с таким id.
# Автор: Васильев Б.П.
#
# Первый параметр: целевой файл
# Второй параметр: необязательный, id блока, под который нужно это всё засунуть. Оно же относительный путь до директории, где лежит обрабатываемый файл
#echo "компилим файл \"$1\". Вставляем его в блок с id=\"$2\""

init_path=$(pwd)
if test $# -gt 2;
then cd $2
fi
echo -n > $1.tmp
echo "#-*- coding: utf-8 -*-" >> $1.tmp
echo "import sys, re" >> $1.tmp
echo "if len(sys.argv) == 1:" >> $1.tmp
echo "    p_prefix = ''" >> $1.tmp
echo "else:" >> $1.tmp
echo "    p_prefix = '#' + sys.argv[1] + ' '" >> $1.tmp
echo "a = ''" >> $1.tmp
echo "for line in sys.stdin.readlines():" >> $1.tmp
echo "    a += line.replace('\n', '')" >> $1.tmp
echo "a = re.sub(re.compile(\"/\*.*?\*/\",re.DOTALL ) ,\"\" ,a)" >> $1.tmp
echo "a = re.sub(re.compile(\"\s*{\s*\",re.DOTALL ) ,\"{\" ,a)" >> $1.tmp
echo "a = re.sub(re.compile(\"\s*}\s*\",re.DOTALL ) ,\"}\" ,a)" >> $1.tmp
echo "a = re.sub(re.compile(\"\s*;\s*\",re.DOTALL ) ,\";\" ,a)" >> $1.tmp
echo "a = re.sub(re.compile(\"\s*:\s*\",re.DOTALL ) ,\":\" ,a)" >> $1.tmp
echo "a = re.sub(re.compile(\"\s*,\s*\",re.DOTALL ) ,\",\" ,a)" >> $1.tmp
echo "b = ''" >> $1.tmp
echo "tmp_in = ''" >> $1.tmp
echo "tmp_out = ''" >> $1.tmp
echo "inbrackets = False" >> $1.tmp
echo "for index in range(0, len(a)):" >> $1.tmp
echo "    i = a[index]" >> $1.tmp
echo "    if i == '{':" >> $1.tmp
echo "        inbrackets = True" >> $1.tmp
echo "        b += p_prefix + tmp_out" >> $1.tmp
echo "        tmp_out = ''" >> $1.tmp
echo "    if inbrackets:" >> $1.tmp
echo "        tmp_in += i" >> $1.tmp
echo "    else:" >> $1.tmp
echo "        if i == ',':" >> $1.tmp
echo "            tmp_out += ',' + p_prefix" >> $1.tmp
echo "        else:" >> $1.tmp
echo "            tmp_out += i" >> $1.tmp
echo "    if i == '}':" >> $1.tmp
echo "        inbrackets = False" >> $1.tmp
echo "        b += tmp_in" >> $1.tmp
echo "        tmp_in = ''" >> $1.tmp
echo "print b" >> $1.tmp
cat $1 | python $1.tmp $2 > $1.tmp2
mv $1.tmp2 $1
rm $1.tmp
cd $init_path
