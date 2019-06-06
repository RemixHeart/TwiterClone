var LikeBtns = document.querySelectorAll("#likeBtn");

LikeBtns.forEach((eachBtn, pos) => {
	eachBtn.onclick = function(){
		console.log(pos);
	}
});
