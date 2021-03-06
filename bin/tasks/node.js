﻿

module.exports = function (grunt) {

    'use strict';

    var LinearPath = require('../lib/LinearPath');
    var Tasks = require('../lib/Tasks');

    var name = 'node';

    var list = LinearPath.linearize({
        dir: '<%=dir.src%>',
        files: [
            {
                dir: 'core',
                files: [
                    'Meta.js',
                    'ModuleManager.js',
                ]
            },
            {
                dir: 'excore',
                files: [
                    'Config.js',
                    'DefineJS.js',
                    'Object.js',
                ]
            },
            {
                dir: 'defaults',
                files: [
                    {
                        dir: 'node',
                        files: [
                            'defaults.js',
                        ],
                    },
                ],
            },
            {
                dir: 'node',
                files: [
                    'Directory.js',
                    'DefineJS.js',
                ],
            },
            
        ]
    });

    /*
    * 运行 grunt node 即可调用本任务
    */
    grunt.registerTask(name, function (level) {

        var home = '<%=dir.build%>' + name;
        var file = 'defineJS.js';
        var dest = home + '/' + file;


        Tasks.run('concat', name, {
            dest: dest,
            src: list,
        });

        Tasks.run('copy', 'package', {
            src: '<%=dir.root%>package.json',
            dest: home + '/package.json',
        });

        Tasks.run('copy', 'readme', {
            src: '<%=dir.root%>readme.md',
            dest: home + '/readme.md',
        });



        ////!!!!test
        //Tasks.run('copy', name, {
        //    src: dest,
        //    dest: 'E:/Kingdee/PanoramioPhoto/f/' + file,
        //});
    });


};