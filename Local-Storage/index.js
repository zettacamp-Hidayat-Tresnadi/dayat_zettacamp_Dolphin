const items = [
    {
        id: 1,
        name: 'Buku A',
        totalCount: 3,
        author: 'Dayat',
        description: 'buku bagus rekomendasi',
    },
    {
        id: 2,
        name: 'Buku B',
        totalCount: 3,
        author: 'Dayat',
        description: 'buku bagus rekomendasi sekali',
    },
]

function readAll() {
    if (!localStorage.getItem('items')) {
        localStorage.setItem('items', JSON.stringify(items));
    }
    let listItems = localStorage.getItem('items');
    listItems = JSON.parse(listItems);
    let fetching = document.getElementById('fetching-Book')
    let elements = ""
    listItems.forEach((element, index) => {
        let data = `<tr>
    <td>${element.name}</td>
    <td>${element.totalCount}</td>
    <td>${element.author}</td>
    <td>${element.description}</td>
    <td><button onclick ={fetchBookId(${element.id})}>Edit</button></td>
    <td><button onclick ={deleteBook(${element.id})}>Delete</button></td>
    </tr>`
        elements += data
    })
    fetching.innerHTML = elements
}

function addBook(event) {
    const formBook = document.getElementById('book-Form');
    let id = Math.floor(Math.random()*100000)
    event.preventDefault();
    // Get the values from the form fields
    const name = document.getElementById('name').value;
    const totalCount = document.getElementById('totalCount').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;
    // Create an object to store the form data
    const formData = {
        id:  id,
        name: name,
        totalCount: +totalCount,
        author: author,
        description: description,
    };
    // console.log(formData);
    let addedData = localStorage.getItem('items');
    addedData = JSON.parse(addedData);
    addedData.push(formData);
    // Clear the form fields
    document.getElementById('name').value = '';
    document.getElementById('totalCount').value = '';
    document.getElementById('author').value = '';
    document.getElementById('description').value = '';
    localStorage.setItem('items', JSON.stringify(addedData));
    readAll()
    document.getElementById("data-Book").style.display = ''
    document.getElementById("trigger-Hide-Table").style.display = 'block'
    document.getElementById("book-Form").style.display = 'none'
    document.getElementById('homePage').style.display=''
}

function hideShowForm(event) {
    event.preventDefault();
    //   hide form and show form when add book clicked
    const myElement = document.getElementById('data-Book');
    const myElement2 = document.getElementById('book-Form');
    const toggleLink = document.getElementById('trigger-Hide-Table');
    const myElement3 =document.getElementById('book-Form-Edit')
    

    if (myElement.style.display === 'none') {
        myElement.style.display = 'block';
        myElement2.style.display = 'none';
        toggleLink.style.display = 'block';
        myElement3.style.display='none'
    } else {
        myElement.style.display = 'none';
        myElement2.style.display = 'block';
        toggleLink.style.display = 'none';
        myElement3.style.display='none'
        document.getElementById("homePage").style.display='none'
    }
}

function deleteBook(id) {
    let deleteData = localStorage.getItem('items');
    let parsingData = JSON.parse(deleteData)
    let filteredData = parsingData.filter((element)=>{
        return id !== element.id
    })
    let stringData = JSON.stringify(filteredData)
    localStorage.setItem('items', stringData)
    readAll()
}
function fetchBookId(id) {
    let listItems = localStorage.getItem('items');
    let parsingData = JSON.parse(listItems);
    let selectedBook = parsingData.filter((element)=>{
        return element.id ===id
    })
    const formBook = document.getElementById('book-Form-Edit');
    document.getElementById('name1').value = selectedBook[0].name;
    document.getElementById('totalCount1').value = selectedBook[0].totalCount;
    document.getElementById('author1').value = selectedBook[0].author;
    document.getElementById('description1').value = selectedBook[0].description;
    document.getElementById("book-Form-Edit").style.display = ''
    document.getElementById('data-Book').style.display='none'
    document.getElementById("trigger-Hide-Table").style.display='none'
    document.getElementById("homePage").style.display='none'
    localStorage.setItem('idBook',selectedBook[0].id)
}

function editBook(id, event) {
    const formBook = document.getElementById('book-Form-Edit');
    event.preventDefault();
    // Get the values from the form fields
    const name = document.getElementById('name1').value;
    const totalCount = document.getElementById('totalCount1').value;
    const author = document.getElementById('author1').value;
    const description = document.getElementById('description1').value;
    const idBook = localStorage.getItem('idBook')
    // Create an object to store the form data
    const formData = {
        id: +idBook,
        name: name,
        totalCount: +totalCount,
        author: author,
        description: description,
    };
    // console.log(formData);
    let addedData = localStorage.getItem('items');
    addedData = JSON.parse(addedData);
    let newData = addedData.map((element)=>{
        if(element.id==formData.id){
            element=formData
        }
        return element
    })
    localStorage.setItem('items', JSON.stringify(newData));
    // Clear the form fields
    document.getElementById('name1').value = '';
    document.getElementById('totalCount1').value = '';
    document.getElementById('author1').value = '';
    document.getElementById('description1').value = '';
    readAll()
    document.getElementById("data-Book").style.display = ''
    document.getElementById("trigger-Hide-Table").style.display = 'block'
    document.getElementById("book-Form").style.display = 'none'
    document.getElementById("book-Form-Edit").style.display = 'none'
    document.getElementById('homePage').style.display=''
    localStorage.removeItem('idBook')
}