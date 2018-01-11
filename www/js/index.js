const app = {
    URL: '',
    KEY: 'liu00414-cordova',
    DATA: null,
    init: function () {
        //check localstorage
        //if don't have localstorage
        if (!localStorage.getItem(app.KEY)) {
            app.getData();

        } else {
            //if already have localstorage
            //check timestamp
            app.DATA = JSON.parse(localStorage.getItem(app.KEY));
            let timestamp = app.DATA.timestamp;
            let nowtime = Date.now().toString();
            let howlong = nowtime - timestamp;
            console.log(howlong);
            //if timestamp is 1h/3600000 ago, redo the fetch
            if (howlong >= 3600000) {
                app.getData();
            } else {
                //if timestamp within 1h, then run showThings()
                app.showThings();
            };
        }
        //fetch the data
        //add event listeners 
        app.addListeners();
        //fix the current url
        history.replaceState({}, "List", "#list");
        document.title = 'List of Items';
    },
    addListeners: function () {
        //back button on second page
        let homeBtn = document.querySelector('button.home');
        homeBtn.addEventListener('click', app.backHome);
        let detailBtn = document.querySelector('button.detail');
        detailBtn.addEventListener('click', app.showDetails);
        //listen for the browser back button
        window.addEventListener('popstate', app.browserBack);
    },
    getData: function () {

        fetch('https://liu00414.github.io/cordova-app-data/data.json', {method:'get', mode:'cors'})
            .then(response => response.json())
            .then((json) => {
                console.log(json.drinks);
            //sort data
            json.drinks.sort(function (a, b) {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
                //add timestamp
                let timestamp = Date.now().toString();
                json.timestamp = timestamp;
                app.DATA = json;
                console.log(app.DATA);
                localStorage.setItem(app.KEY, JSON.stringify(app.DATA));
                app.showThings();
            })
            .catch(function (err) {
                alert(err);
            })

        //fetch the JSON data
        //fetch()
        //.then()
        //.then(
        //save the imported JSON into app.DATA

        //pass the data to a function that builds the first page  
        //app.showThings();
        //).catch();
    },
    showThings: function () {
        //loop through the array and display the cards
        let listContent = document.querySelector('#list-page section');
        listContent.innerHTML='';
       console.log(app.DATA.drinks[1].name); app.DATA.drinks.forEach((drink) => {
            let df = new DocumentFragment();
            let cardDiv = document.createElement('div');
           cardDiv.className='item-card';
           cardDiv.setAttribute('data-key', drink.id);
            let img = document.createElement('img');
           img.className='icon';
           img.src='img/drink-img/'+drink.name+'.svg';
           img.alt=drink.name+' image';
            let h2 = document.createElement('h2');
           h2.className='item-title';
           //h2.setAttribute('data-key', drink.id);
            h2.textContent=drink.name;
            let p = document.createElement('p');
           p.innerHTML='Type: '+drink.type+'<br>Origin: '+drink.origin;
           p.className='item-desc';
            cardDiv.appendChild(img);
            cardDiv.appendChild(h2);
            cardDiv.appendChild(p);
            df.appendChild(cardDiv);
            listContent.appendChild(df);
        });
        //add the click listener on each title
        let cards = document.querySelectorAll('.item-card');
        cards.forEach.call(cards, (div) => {
            div.addEventListener('click', app.navDetails);
        });
    },
    navDetails: function (ev) {
        ev.preventDefault();
        console.log('ev', ev.currentTarget);
        window.scrollTo(0, 0);
        let h2 = ev.currentTarget;
        //extract the id from the heading
        let id = h2.getAttribute('data-key');
        //change the url and save the id in the history.state
        console.log(`#details/${id}`);
        history.pushState({
            "id": id
        }, "Details", `#details/${id}`);
        document.title = `Details for Item ${id}`;
        //get the info about this item
        let obj = app.getItem(id);
        //pass it to a function to display those details
        app.showDetails(obj);
        console.log('obj', obj)
    },
    getItem: function (id) {
        //retrieve an object from our JSON data
        //where the id matches the one passed to this function
        let selecDrink=app.DATA.drinks.filter(drink=>drink.id==id);
        console.log(selecDrink);
        //dummy data for demonstration purposes
        //sort ingredients date
        selecDrink[0].ingredients.sort(function (a, b) {
        let nameA = a.toUpperCase();
        let nameB = b.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
        return selecDrink[0];
//            id: 123,
//            title: `Thing ${history.state.id}`,
//            prop1: "some text",
//            prop2: "some number",
//            prop3: "more text"
        
        
    },
    showDetails: function (obj) {
        //navigate to the second page
        document.getElementById('list-page').classList.remove('active');
        document.querySelector('.home').classList.remove('tab-active');
        document.getElementById('details-page').classList.add('active');
        document.querySelector('button.detail').classList.add('tab-active');
        if(obj.type==="click"){
                
        }else{
        document.querySelector('header h1').innerHTML=obj.name+'\'\s Ingredients';
        //set the title of the selected property
        //let span = document.querySelector('.details-title');
        //span.textContent = obj.title;
        //loop through the obj properties with a for in loop
        //create some HTML for each property...
        let detailContent= document.querySelector('#details-page section');
        let df =new DocumentFragment();
        let div =document.createElement('div');
        img=document.createElement('img');
        img.src='img/drink-img/'+obj.name+'.svg';
        img.className='detail-img';
        img.alt='detail image of'+obj.name;
        div.appendChild(img);
        div.className='detail';
        
        for(index in obj.ingredients){
         p=document.createElement('p');
           p.textContent= obj.ingredients[index];
        
            div.appendChild(p);
            
            console.log(obj.ingredients[index]);
        };
        detailContent.innerHTML='';
        df.appendChild(div);
        detailContent.appendChild(df);
        let link=document.createElement('a');
            link.textContent='Find '+obj.name;
        link.className='find-button';
            link.href='http://'+obj.website;
            div.appendChild(link);
        console.log('obj.web');
        console.log(obj);
        }

    },
    backHome: function (ev) {
        if (ev) {
            ev.preventDefault();
            //only add to the pushState if the user click OUR back button
            //don't do this for the browser back button
            history.pushState({}, "List", `#list`);
            document.title = 'List of Items';
        }
        document.getElementById('list-page').classList.add('active');
        document.querySelector('.home').classList.add('tab-active');
        document.getElementById('details-page').classList.remove('active');
        document.querySelector('.detail').classList.remove('tab-active');
        document.querySelector('header h1').innerHTML='Summer Drinks';
    },
    browserBack: function (ev) {
        console.log('user hit the browser back button');
        //the browser will change the location hash.
        //use the updated location.hash to display the proper page
        if (location.hash == '#list') {
            console.log('show the list page');
            //we want to show the list page
            app.backHome();
            //NOT passing the new MouseEvent('click')
        } else {
            //we want to display the details
            console.log('show the details');
            let id = location.hash.replace("#details/", "");
            //use the id number from the hash to fetch the proper data
            let obj = app.getItem(id);
            //pass it to a function to display those details
            app.showDetails(obj);
        }
    }
}

let loadEvent = ('deviceready' in document) ? 'deviceready' : 'DOMContentLoaded';
document.addEventListener(loadEvent, app.init);
