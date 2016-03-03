Meteor.startup(function() {
  if (FoodOffer.find().count() === 0) {
    for ( var i = 0; i < 15; i++) {
      FoodOffer.insert(food[i]);  
    }
  };  
});

var food = [
    {title: 'Pizza express', price: 42, discount: 0, category: 'pizza'},
    {title: 'Pizza Regina', price: 48, discount: 0, category: 'pizza'},
    {title: 'Pizza napolitaine', price: 39, discount: 0, category: 'pizza'},
    {title: 'Pizza quatre fromages', price: 53, discount: 0, category: 'pizza'},
    {title: 'Pizza Bollywood', price: 60, discount: 0, category: 'pizza'},

    {title: 'salade Cesar', price: 21, discount: 0, category: 'salade'},
    {title: 'Salade d\'hiver à l\'endive', price: 18, discount: 0, category: 'salade'},
    {title: 'Salade originale', price: 19, discount: 0, category: 'salade'},
    {title: 'Salade poulet', price: 22, discount: 0, category: 'salade'},
    {title: 'Salade Sud-Ouest', price: 25, discount: 0, category: 'salade'},

    {title: 'Beer', price: 5, discount: 0, category: 'drink'},
    {title: 'Lemonade', price: 4, discount: 0, category: 'drink'},
    {title: 'Caffe latte', price: 6, discount: 0, category: 'drink'},
    {title: 'Cappuccino', price: 6, discount: 0, category: 'drink'},
    {title: 'Americano', price: 6, discount: 0, category: 'drink'}
  ];