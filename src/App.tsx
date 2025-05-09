import './App.css'

function App() {
  const handleClick = () => {
    const rs = document.getElementById('right-side');

    if(!rs) return;

    rs.style.background = 'blue';
    rs.style.fontSize = '5rem';
    rs.innerHTML = "Hello";
  }

  return (
    <main>
      <div id='head'>
        <h3>Logo</h3>
      </div>
      <div className='content'>
        <div>
          <h1>ເນື້ອຫາຊ້າຍ</h1>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
        <div>Center</div>
        <div id='right-side'>ເນື້ອຫາຂວາ</div>
      </div>
      <div id="div-btn">
        <button onClick={handleClick} className='btn'>Change me</button>
      </div>
      <h1 className="text-blue-900 text-3xl">ສະບາຍດີ Tailwind!</h1>
      <div className="bg-yellow-500 text-gray-950 p-4">ສີ ເຫຼື ອງ</div>
      <div className="w-64 h-32 bg-green-500 m-4 text-gray-50 text-2xl font-extrabold">ກ່ ອງຂະໜາດກໍານົດ</div>
      <p className="text-xl font-bold text-center bg-blue-200">ຂ້ໍ ຄວາມໃຫຍ່ </p>
      <div className="bg-blue-500 text-white p-4 sm:bg-red-500 md:bg-blue-500 lg:bg-avocado-500 md:text-left lg:text-2xl">
 Responsive Test
 </div>
    </main>
  )
}

export default App
