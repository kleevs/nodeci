// import * as process from 'process';
// import * as path from 'path';
// const [rootDir, workDir, name, variable] = process.argv.slice(2);
// const context = {
//     workfolder: workDir
// }
// const plugin = (() => {
//     try {
//         return require(path.resolve(rootDir, `plugin/${name}`));
//     } catch (e) {
//         return require(`../../plugin/${name}`);
//     }
// })();
// process.stdout.write = (function(write) {
//     return function (string, encoding, fd) {
//         write.apply(process.stdout, arguments)
//         process.send(string);
//     } as any;
// })(process.stdout.write);
// plugin.default(context, JSON.parse(variable));
