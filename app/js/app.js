$ (function (){
	class User {
		constructor(avatar, comment, words, admin, userName) {
			this.avatar = avatar,
			this.comment = comment,
			this.words = words,
			this.admin = admin,
			this.userName = userName
		}
	}

	// fonction qui clean les tableau des participants
	cleanArray = (array) => {
		var i, j, len = array.length,
		out = [], obj = {};
			for ( i = 0; i < len; i++ ) {
				obj[array[i]] = 0;
			}
			for ( j in obj ) {
				out.push(j);
			}
		return out;
	}

	$('#btn-url-github').on('click', function(e) {
		e.preventDefault();
		const getUrl 		= $('#url-github').val(),
				splitGetUrl = getUrl.split('https://github.com/'),
				myUrl 		= splitGetUrl[1];

		// stocks tt la conversation en objets
		const myUsers = [];

		//Appel ajax Admin
		ajaxGet( `https://api.github.com/repos/${myUrl}`, function( data ) {
			const profil 			= $.parseJSON(data);
			let 	avatarUser 		= profil.user.avatar_url,
					commentUser 	= profil.body,
					userName			= profil.user.login,
					words 			= profil.body.length;

			$('.search form').after(`<h3>${profil.title}</h3>`);
			$('#infos')
				.append(`<div class="wrap-user-comment" data-user=${userName} data-words="${words}"></div>`);
			$('.wrap-user-comment')
				.append(`<img class="avatar-github" src=${avatarUser} />`)
				.append(`<p>${commentUser}</p>`);

			const userOwner = new User(avatarUser, commentUser, words, true, userName);
			myUsers.push(userOwner);
		});


		//Appel ajax Autre User
		ajaxGet( `https://api.github.com/repos/${myUrl}/comments`, function( data ) {
			const profilComments = $.parseJSON(data);
			const ownerIssues = $('.wrap-user-comment').first().data('user');

			// push chaque objet user dans mon tab myUsers
			for ( comment in profilComments ) {
				
				let 	avatarUser 		= profilComments[comment].user.avatar_url,
						commentUser 	= profilComments[comment].body,
						words 			= profilComments[comment].body.length,
						userName			= profilComments[comment].user.login,
						userId 			= `user${comment}`;
				
				if ( userName === ownerIssues ) {
					userId = new User(avatarUser, commentUser, words, true, userName);
				} else {
					userId = new User(avatarUser, commentUser, words, false, userName);
				}
				myUsers.push(userId);
			}

			// créer tout les commentaires
			for ( user in myUsers) {
				$('#infos')
					.last()
					.append(`<div class="wrap-comment" data-user=${myUsers[user].userName} data-words=${myUsers[user].words}></div>`);
				$('.wrap-comment')
					.last()
					.append(`<img class="avatar-github" src=${myUsers[user].avatar} />`)
					.append(`<p>${myUsers[user].comment}</p>`);

				if ( myUsers[user].admin === true ) {
					$('.wrap-comment').eq(user).addClass('wrap-user-comment');
				}
			}

			// supprime le premier commentaire et clean les class dans le DOM
			$('#infos .wrap-user-comment').first().remove();
			$('.wrap-user-comment').removeClass('wrap-comment');

			// stock tt les participants de la conversation
			const participantsAvatar = [],
					participantsUserName = [];
			
			for ( tab in myUsers ) {
				const tableau = [];
				let 	avatar = myUsers[tab].avatar,
						userName = myUsers[tab].userName;

				participantsAvatar.push(avatar);
				participantsUserName.push(userName);
			}
			console.log(participantsAvatar, participantsUserName);

			// Enleve les doublons du tableau des participant
			const cleanParticipantAvatar = cleanArray(participantsAvatar);
			const cleanParticipantUserName = cleanArray(participantsUserName);

			console.log(cleanParticipantAvatar, cleanParticipantUserName);
		});


		$('#url-github').val('');
	});
});