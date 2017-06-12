module.exports = function(){
	var main = main||{};
	main = {
		echo: function(){
			console.log('a.js OK!');
		}
	};
	return main;
}