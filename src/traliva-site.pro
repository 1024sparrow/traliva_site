module.exports = {
    target: '../compiled',
    file:{
        css: function(s){ //подключить скрипт
            return '/* :) */\n'+s;
        },
        global_bg: 'scripts/tabs_meta/global_bg.js',
        header_height: 'scripts/tabs_meta/header_height.js',
        headerlevel_style: 'scripts/tabs_meta/headerlevel_style.js'
    },
    dir:{
        inputdata_dir: 'scripts/tabs_meta/process_dir.js',
        ditribute_results: 'scripts/distribute_results.sh'
    }
}
