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

	class Participant {
		constructor (avatar, userName, words) {
			this.avatar = avatar,
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

	$('.js-size').hide();
	$('#btn-url-github').on('click', function(e) {
		e.preventDefault();
		$('#member, #infos').children().remove();
		$('.search h3').remove();
		const getUrl 		= $('#url-github').val(),
				splitGetUrl = getUrl.split('https://github.com/'),
				myUrl 		= splitGetUrl[1];
		$('.js-size').show();
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
			// Enleve les doublons du tableau des participant
			const cleanParticipantAvatar = cleanArray(participantsAvatar);
			const cleanParticipantUserName = cleanArray(participantsUserName);
		
			// affiches tout les membres
			for ( member in cleanParticipantAvatar ) {
				let 	userId 	= `user${comment}`,
						avatar 	= cleanParticipantAvatar[member],
						userName = cleanParticipantUserName[member];
				// cré l'objet des participants
				userId  = new Participant(avatar, userName);
				
				$('#member')
					.append('<div class="wrap-member"></div>');
				$('.wrap-member')
					.last()
					.attr('data-user', `${userId.userName}`)
					.append(`<img class="avatar-github" src=${userId.avatar}/>`)
					.append(`<p>${userId.userName}</p>`)
					.append(`<input type="checkbox"/>`);
			}

		// mettre la taille de la partie membre à la meme taille que conversation
		const sameHeight = $('.js-size').outerHeight(true);
		$('.wrap-users-member').outerHeight(sameHeight);

		// chaque mots des utilisateur stocké dans un array
		const words = [];
			$.each(cleanParticipantUserName, function (index, value) {
				const idWord = [];
				let name = $(`#infos div[data-user="${cleanParticipantUserName[index]}"]`);
			  	$.each(name, function (index, value) {
				  	let wordName = name.eq(index).attr(`data-words`);
		  			parseInt(wordName);
				  	idWord.push(wordName);
				});
			words.push(idWord);
		});

		// additionner les mots des utilisateurs les stocker et les mettre dans le plugins
		const dataWords = [];
		for ( loop in words ) {
			let count = words[loop].length,
			total = 0;
			for ( let i = 0; i < words[loop].length; i++ ) {
				let res = parseInt(words[loop][i]);
				total += res;
			}
			dataWords.push(total);
		}

		// insertion etconfig du piechart
		var ctx = document.getElementById('myChart').getContext('2d');
			var chart = new Chart(ctx, {
			    // The type of chart we want to create
			    type: 'pie',
			    // The data for our dataset
			    data: {
			        labels: cleanParticipantUserName,
			        datasets: [{
			            label: "My First dataset",
			            backgroundColor: '#0def87',
			            data: dataWords,
			        }]
			    },
			    // Configuration options go here
			    options: {}
			});
			console.log(dataWords);
		});
		$('#url-github').val('');
	});

	$(document).on('click', '.wrap-member', function(){
		const checked = $(this).attr('data-user');
		$(this).find('input').prop("checked");
		$(this).toggleClass('wrap-member-hide')
		const hideThis = $('#infos').find(`[data-user=${checked}]`);
		hideThis.toggle();
	});

});