var app = app || {};

app.userVasya = new app.UserModel({
	name: 'vasya',
	email: 'vasya@gmail.com',
	password: '12345',
	selected: false
});

app.userPetya = new app.UserModel({
	name: 'petya',
	email: 'petya@gmail.com',
	password: '54321',
	selected: false
});

app.userbase = new app.UserBase();

app.userbase.add(app.userVasya);
app.userbase.add(app.userPetya);

app.userView = new app.UserView({});