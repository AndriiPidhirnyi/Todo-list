var app = app || {};

app.userVasya = new app.UserModel({
	name: 'Vasya',
	email: 'vasya@gmail.com',
	password: '12345',
	selected: false
});

app.userPetya = new app.UserModel({
	name: 'Petya',
	email: 'petya@gmail.com',
	password: '54321',
	selected: false
});

app.userbase = new app.UserBase();

app.userbase.add(app.userVasya);
app.userbase.add(app.userPetya);

app.userView = new app.UserView({});