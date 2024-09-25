import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'

const Page = ({Content,handleContentChange}) => {

    const divref=useRef(null)

    useEffect(()=>{
      if(divref){
        divref.current.innerHTML=Content
      }
    },[Content])

    

    // Save and restore the cursor position
  const saveSelection = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    return range;
  };

  const restoreSelection = (range) => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };


    const handleDocChange=(e)=>{
     // const range = saveSelection();
        const d=e.target.innerHTML
        handleContentChange(d)
     // restoreSelection(range);
    }
    

  return (
    <div className=' w-full h-full px-14 py-9'>

        <div 
         contentEditable={true}
        ref={divref}
        onBlur={(e)=>handleDocChange(e)}
        spellCheck={false}
        className='w-full h-full bg-white focus:outline-none p-4 '>
        </div>

    </div>
  )
}

export default Page