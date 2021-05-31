var bt = require('./lib/bing-translate.js').init({
	client_id: 'your_client_id'
});

bt.translate('This hotel is located close to the centre of Paris.', 'en', 'ro', function(err, res){
	console.log(err, res);
});

bt.detect('Guess the language.', function(err, res){
	console.log(err, res);
});

bt.getLanguagesForTranslate(function(err, res){
	console.log(err, res);
});

// this example will throw an exception error because "se" is not recognised
// as language in bing
bt.translate('ska', 'se', 'en', function(err, res){
  console.log(err, res);
});