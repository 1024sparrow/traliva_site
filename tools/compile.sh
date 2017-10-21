#!/bin/bash +x
# компиляция всех js-файлов в 1-4 файлов (разделение по предназначению, согласно файлам описания __meta__)
####
# Формат __meta__:
# <имя_файла-назначения>;<формат_файла(какая обработка постобработка нужна, по умолчанию пропускает файл)>:
# <список файлов, из которых будет сформирован целевой файл, разделение - перевод строки>
#
# Пустые строки и комментарии не допустимы
#
# #!dir - указание оставить директорию как есть. Эта строчка должна быть первой в файле. После этой команды все последующие строки трактуются как команды на выполнение (эти команды должны быть предопределены в данном скрипте compile.sh)
####

# http://linuxgeeks.ru/bash-1.htm
# http://linuxgeeks.ru/bash-2.htm
# https://www.opennet.ru/docs/RUS/bash_scripting_guide/c12790.html
# https://stackoverflow.com/questions/2564634/convert-absolute-path-into-relative-path-given-a-current-directory-using-bash
# sed -i ':a;N;$!ba;s/\n/\t/g' file_with_line_breaks - заменяет все '\n' на ' ' в файле
# cat $tmp/$row | tr '\n' ' ' >> $relPath/$file_id

#if [[ -z compile.ini ]]
#destpath=$([ -s "compile.ini" ] && cat compile.ini || echo hello)

initial_path=$(pwd)
cd $(echo $0 | sed 's/\/.*$//g')
srcPath=$(pwd)
#srcPath=$(echo $0 | sed 's/\/.*$//g')
if [ -s compile.ini  ]
    #then destPath=../tab_apps
    then destPath=../$(cat compile.ini)
else
    echo "Файл compile.ini с указанием целевой директории не найден. Компиляция не произведена."
    cd $initial_path
    exit 0
fi
debug_mode="true"

##############################################

function act__html_dir_template {
    # В файле, одноимённом текущей директории, заменяем
    # "++++" на "/static/tab_apps/vm/html/text/"

    local filename=''
    for i in $(echo "$relPath" | tr '/' '\n')
    do filename="$i"
    done
    local tmpPath=${relPath}/$filename
    echo $tmpPath
    if [ -z tmpPath ]
        then echo "Критическая ошибка: файл, который надо поправить, не найден"
        return
    fi
    sed -e "s/\+\+\+\+/\/static\/tab_apps\/$(echo "$relPath" | sed -e 's/\//\\\//g')\//g" $tmpPath >> ${tmpPath}.tmp
    mv ${tmpPath}.tmp ${tmpPath}
}

function act__css_compile {
    # Первый параметр: целевой файл
    # Второй параметр: необязательный, id блока, под который нужно это всё засунуть. Оно же относительный путь до директории, где лежит обрабатываемый файл
    #echo "компилим файл \"$1\". Вставляем его в блок с id=\"$2\""

    local init_path=$(pwd)
    if test $# -gt 1;
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
}

##############################################

function get_relative {
# params:
#   (1) - dirPath without '/' at the end ;
#   (2) - path to dest file (only real file, not folder).

    local source=$1
    local target=$2

    local common_part=$source
    local result=""

    while [[ "${target#$common_part}" == "${target}" ]]; do
        # no match, means that candidate common part is not correct
        # go up one level (reduce common part)
        common_part="$(dirname $common_part)"
        # and record that we went back, with correct / handling
        if [[ -z $result ]]; then
            result=".."
        else
            result="../$result"
        fi
    done

    if [[ $common_part == "/" ]]; then
        # special case for root (no common path)
        result="$result/"
    fi

    # since we now have identified the common part,
    # compute the non-common part
    forward_part="${target#$common_part}"

    # and now stick all parts together
    if [[ -n $result ]] && [[ -n $forward_part ]]; then
        result="$result$forward_part"
    elif [[ -n $forward_part ]]; then
        # extra slash removal
        result="${forward_part:1}"
    fi

    echo $result
}

#if [[ $# -eq 0 ]]
#then
#    echo "запуск без параметров невозможен: укажите путь к директории, в которой лежат исходные js-файлы. Результаты компиляции будут размещены в текущей директории (запускайте данный скрипт из \"static/\"). Для перезаписи существующих файлов скрипт не запрашивает подверждения."
#    exit
#fi


cd $destPath
#echo -n 'Будут удалены все данные из текущей директории. Продолжить (y/n)? '
#read cont
#if [[ $cont != y ]]; then exit;fi

rm -rf *

for tmp in $(find  $srcPath -type d)
do
    #echo $tmp
    relPath=$(get_relative $srcPath $tmp)
    #echo $relPath

    metaPath=$relPath
    if [ -n "$metaPath" ]
    then
        metaPath=${metaPath}/
    fi
    metaPath=${metaPath}__meta__
    #echo $metaPath
    if [ -f $srcPath/$metaPath ]
    then
        if [ -n "$relPath" ]
        then
            mkdir -p $relPath
        fi
        file_id="unsorted"
        file_type=""
        command_mode=false
        command_list=()
        for row in $(cat $srcPath/$metaPath)
        do
            #echo "row : \"$row\""
            #echo ----------- $srcPath/$row

            if [[ "$row" == "#!dir" ]]
            then
                tmpPath=''
                if [ -n "$relPath" ]
                then
                    tmpPath=$relPath/
                else
                    tmpPath=/
                fi
                cp -rf $tmp/* $tmpPath 
                rm $tmpPath/__meta__
                #break
                command_mode=true
                continue
            fi

            if [ "$command_mode" = true ]
            then
                command_list=( "${command_list[@]}" "$row" )
            else
                if [[ "$row" == *: ]]
                then
                    file_id=''
                    file_type=''
                    pair=$(echo "${row::-1}" | tr ';' '\n')
                    for i in $pair
                    do
                        if [ -z $file_id ]
                        then
                            file_id=$i
                        else
                            file_type=$i
                        fi
                    done
                    #file_id="${row::-1}"
                    #echo file_id="${row::-1}"
                    if [ -n "$relPath" ]
                    then
                        echo -n > $relPath/$file_id
                        echo $relPath/$file_id
                    else
                        echo -n > $file_id
                        echo $file_id
                    fi
                else
                    tmpPath=''
                    if [ -n "$relPath" ]
                    then
                        tmpPath=$relPath/$file_id
                    else
                        tmpPath=$file_id
                    fi
                    if [[ "$file_type" == html_to_string ]]
                    then
                        cat $tmp/$row | sed "s/$/\\\\n/g" | sed "s/\"/\\\\\"/g" | tr -d \\n >> $tmpPath
                    elif [[ "$file_type" == "js_to_string" ]]
                    then
                        cat $tmp/$row | sed "s/$/\\\\n/g" | sed "s/\"/\\\\\"/g" | tr -d \\n >> $tmpPath
                    elif [[ "$file_type" == "js" ]]
                    then
                        cat $tmp/$row >> $tmpPath
                    elif [[ "$file_type" == "css_dirprefix" ]]
                    then
                        cat $tmp/$row >> $tmpPath
                        # если в command_list нет, то добавляем
                        tmp=$relPath
                        if [[ -z $tmp  ]]
                        then
                            tmp='.'
                        fi
                        command_list=( "${command_list[@]}" "css_compile:${file_id}:${tmp}" )
                    elif [[ "$file_type" == "css" ]]
                    then
                        cat $tmp/$row >> $tmpPath
                        # если в command_list нет, то добавляем
                        command_list=( "${command_list[@]}" "css_compile:${file_id}" )
                    elif [[ "$file_type" == "json" ]]
                    then
                        cat $tmp/$row | tr -d \\n >> $tmpPath
                    elif [[ "$file_type" == "develop" ]]
                    then
                        if [[ "$debug_mode" == "true" ]]
                        then
                            cat $tmp/$row > $tmpPath
                        fi
                    elif [[ "$file_type" == "css_from_header_meta" ]]
                    then
                        #boris here
                    fi
                    #echo "cat $srcPath/$row > $relPath/$file_id"
                fi
            fi
        done
        #boris here: исполняем все команды (command_list)
        for i in "${command_list[@]}"
        do
            #echo "$i"
            if [[ "$i" == "html_dir_template" ]]
                then act__html_dir_template
            elif [[ "$i" == css_compile:* ]]
            then
                tmp_commandname=''
                tmp_destfile=''
                tmp_prefix=''
                for ii in $(echo "$i" | tr ':' '\n')
                do
                    if [[ -z $tmp_commandname ]]
                        then tmp_commandname=$ii
                    elif [[ -z $tmp_destfile ]]
                        then tmp_destfile=$ii
                    elif [[ -z $tmp_prefix ]]
                        then tmp_prefix=$ii
                    fi
                done
                act__css_compile $tmp_destfile $tmp_prefix
            fi
        done
    fi
done
#cd $srcPath
cd $initial_path
