﻿
/**
* 路径模式工具
*/
define('Patterns', function (require, module, exports) {

    var fs = require('fs');
    var minimatch = require('minimatch');
    var $ = require('$');
    var $String = require('String');

   
    /**
    * 把一个目录和模式列表组合成一个新的模式列表。
    */
    function combine(dir, list) {

        //重载 combine(list);
        if (dir instanceof Array) {
            return dir;
        }

        //重载 combine(item);
        if (!list) {
            return [dir];
        }

        if (!Array.isArray(list)) {
            list = [list];
        }


        var Path = require('Path');

        list = $.Array.map(list, function (item, index) {

            if (typeof item != 'string') {
                return null;
            }

            if (item.indexOf('!') == 0) { //如 '!foo/bar/index.js'
                item = '!' + Path.join(dir, item.slice(1));
            }
            else {
                item = Path.join(dir, item);
            }

            return item;

        });
      
        return list;

    }

    /**
    * 获取指定模式下的所有文件列表。
    */
    function getFiles(dir, patterns) {

        //重载 getFiles(patterns);
        if (Array.isArray(dir)) {
            patterns = dir;
            dir = '';
        }

        //指定了基目录，则组合起来。
        if (dir) {
            patterns = combine(dir, patterns);
        }


        var files = [];
        var Directory = require('Directory');

        patterns.forEach(function (item, index) {
            //"../htdocs/modules/**/*.less"
            //"../htdocs/modules/*.less"
            //"!../htdocs/test.js"
            //"../htdocs/api/"

            if (item.slice(-1) == '/') { //以 '/' 结束，是个目录
                item += '**/*';
                patterns[index] = item; //这里回写进原数组。
            }

            if (item.slice(0, 1) == '!') { // 以 '!' 开头的，如 '!../htdocs/test.js'
                return;
            }
            

            var index = item.indexOf('**/');
            if (index < 0) {
                index = item.indexOf('*');
            }

            if (index < 0) { //不存在 '**/' 或 '*'
                files.push(item);
                return;
            }


            //
            var dir = item.slice(0, index);
            if (!fs.existsSync(dir)) {
                return;
            }

            var list = Directory.getFiles(dir);
            files = files.concat(list);


        });


        files = match(patterns, files);
       

        return files;

    }


    function match(patterns, files) {

        var includes = {};
        var excludes = {};

        patterns.forEach(function (pattern) {

            var excluded = pattern.slice(0, 1) == '!';
            var obj = excluded ? excludes : includes;

            if (excluded) {
                pattern = pattern.slice(1);
            }

            files.forEach(function (file) {
                var matched = minimatch(file, pattern);
                if (matched) {
                    obj[file] = true;
                }
            });
        });

        var matches = Object.keys(includes).filter(function (file) {
            return !(file in excludes);
        });

        return matches;

    }



    return {
        getFiles: getFiles,
        match: match,
    };

});
