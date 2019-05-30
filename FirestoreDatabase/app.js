const cafeList = document.querySelector('#cafe-list'); // refers to cafe-list id in index.html
const form = document.querySelector('#add-cafe-form'); // form id on index.html

// create element and render cafe
function renderCafe(doc) {
    let li = document.createElement('li'); //for each document, DOM manipulation
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id); // sets attribute of li to id of the doucment
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    //documents appended to li tag
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    //appended to cafeList, displays on index
    cafeList.appendChild(li);

    //delete data
    cross.addEventListener('click', (e) => {
        let id = e.target.parentElement.getAttribute('data-id'); //gets the unique id for each doc
        db.collection('cafes').doc(id).delete(); //deletes document
    })
}
//getting data
// references cafes collection, .where() & .orderBy() are queries and insert before get method
// db.collection('cafes').get().then((snapshot) => {   
//     snapshot.docs.forEach(doc => {  //cycles thruogh each doc in the snapshot
//         console.log(doc.data); //displays data in console log
//             renderCafe(doc); // calls function
//     })
// }) 

//saving data
form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    db.collection('cafes').add({ //adds user input value to cafes database
        name: form.name.value, //user input value
        city: form.city.value //user input value
    });
    form.name.value = ''; //empties the name input
    form.city.value = ''; //empties the city input
});

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderCafe(change.doc)
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
})