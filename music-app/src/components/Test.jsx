import {useState,useEffect} from 'react'


export default function Test() {
    const [backendData,setData] = useState([{}])

    useEffect(() => {
        fetch('/test')
        .then(response => response.json())
        .then(data => {setData(data)})
    },[])
    
  return (
    <div>
       
    </div>
  );
}

