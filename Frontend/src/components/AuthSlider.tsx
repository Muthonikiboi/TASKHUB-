import { useState } from "react";

interface Slide {
  image: string;
  title: string;
  description: string;
}

interface AuthSliderProps {
  slides: Slide[];
}

const SliderDiv = {
  width: '100%',
  height: '100vh',
  backgroundColor: '#92e3a9',
  display: 'flex',  
  flexDirection: 'column', 
  justifyContent: 'center', 
  alignItems: 'center', 
};

const Image = {
  width: '100%',
  height: '80vh',
  backgroundColor: 'transparent',
};

const description = {
  textAlign: 'center',
  width: '100%',
  backgroundColor: 'transparent',
  padding: '20px', 
};

const titleStyle = {
  fontSize: '50px',
  fontweight:'bold', 
  backgroundColor: 'transparent' 
};

const titleStyles = {
    backgroundColor: 'transparent'
  };

  const SliderControls = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '10%',
    backgroundColor: 'transparent',
  };

  const btn ={
    width: '15px',
    height: '15px',
    backgroundColor: '#000',
    borderRadius: '50%',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }
function AuthSlider({ slides }: AuthSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div style={SliderDiv}>
      <img
        src={slides[currentIndex].image}
        alt={`Slide ${currentIndex + 1}`}
        style={Image}
      />
      <div style={description}>
        <h1 style={titleStyle}>{slides[currentIndex].title}</h1>
        <h3 style={titleStyles}>{slides[currentIndex].description}</h3>
      </div>
      <div style={SliderControls}>
        <button onClick={goToPrevious} style={btn}></button>
        <button onClick={goToNext}  style={btn}></button>
      </div>
    </div>
  );
}

export default AuthSlider;
