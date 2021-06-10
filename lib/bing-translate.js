const client = {},
  axios = require('axios'),
  { v4: uuidv4 } = require('uuid');

const endpoint = 'https://api.cognitive.microsofttranslator.com';

exports.init = function(creds){
  client.credentials = creds;
  return client;
}

client.setCredentials = function(creds){
  client.credentials = creds;
}

client.translate = async function(text, from, to, callback){
	let token, res, error, translation;

	try {
		token = await client.getToken(client.credentials);
	} catch (err) {
		callback(new Error(err.message), null);
		return;
	}

	const req = {
		method: 'POST',
		baseURL: endpoint,
		url: '/translate',
		headers: {
			'Authorization': 'Bearer ' + token,
			'Content-type': 'application/json',
			'X-ClientTraceId': uuidv4().toString()
		},
		params: {
			'api-version': '3.0',
			'from': from,
			'to': to
		},
		data: [{
			'text': text
		}],
		responseType: 'json'
	};

	try {
		res = await axios(req);
		translation = res.data[0].translations[0].text;
	} catch (err) {
		error = 'parse-exception';
	}

	callback(error, {
		original_text: text,
		translated_text: translation,
		from_language: from,
		to_language: to,
		response: res ? res.data : undefined
	});
}

client.detect =  async function(text, callback){
	let token, res, error;

	try {
		token = await client.getToken(client.credentials);
	} catch (err) {
		callback(new Error(err.message), null);
		return;
	}

	const req = {
		method: 'POST',
		baseURL: endpoint,
		url: '/detect',
		headers: {
			'Authorization': 'Bearer ' + token,
			'Content-type': 'application/json',
			'X-ClientTraceId': uuidv4().toString()
		},
		params: {
			'api-version': '3.0'
		},
		data: [{
			'text': text
		}],
		responseType: 'json'
	};

	try {
		res = await axios(req);
	} catch (err) {
		error = 'parse-exception';
	}

	callback(error, {
		original_text: text,
		response: res ? res.data : undefined
	});
}

client.getLanguagesForTranslate = async function(callback){
	let token, res, error;

	try {
		token = await client.getToken(client.credentials);
	} catch (err) {
		callback(new Error(err.message), null);
		return;
	}

	const req = {
		method: 'GET',
		baseURL: endpoint,
		url: '/languages',
		headers: {
			'Authorization': 'Bearer ' + token,
			'Content-type': 'application/json',
			'X-ClientTraceId': uuidv4().toString()
		},
		params: {
			'api-version': '3.0'
		},
		responseType: 'json'
	};

	try {
		res = await axios(req);
	} catch (err) {
		error = 'parse-exception';
	}

	callback(error, {
		response: res ? res.data : undefined
	});
}

client.getToken = async function(credentials){

	const req = {
		method: 'POST',
		baseURL: 'https://api.cognitive.microsoft.com',
		url: '/sts/v1.0/issueToken',
		headers: {
			'Ocp-Apim-Subscription-Key': credentials.client_id,
		}
	};

	try {
		const res = await axios(req);
		return res.data;
	} catch (err) {
		throw err;
	}
}
