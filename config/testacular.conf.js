basePath = '..';

files = [
  JASMINE,
  JASMINE_ADAPTER, 
  'src/main/webapp/js/lib/angular.js',
  'src/test/javascript/lib/angular-mocks.js',
  'src/test/javascript/lib/jquery.js',
  'src/main/webapp/js/controllersXDocReport.js',
  'src/test/javascript/lib/angular-mocks.js',
  'src/test/javascript/spec/controllersXDocReportSpec.js'
  // templates
  //'js/directives/**/*.html'
];

preprocessors = {
  '**/*.html': 'html2js'
};

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
