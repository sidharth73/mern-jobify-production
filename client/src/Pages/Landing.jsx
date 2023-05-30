import React from 'react'
import { useNavigate } from 'react-router-dom';
// import logo from "../assets/images/logo.svg";
import Logo from '../components/Logo';
import main from "../assets/images/main.svg";
import Wrapper from '../assets/wrappers/LandingPage';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
        <nav>
          {/* <img src={logo} alt='jobify' className='logo' /> */}
          <Logo/>
        </nav>
        <div className='container page'>
        <div className='info'>
           <h1>
              job <span>tracking</span> app
           </h1>
           <p>
            I'm baby everyday carry authentic bushwick cray, mustache VHS post-ironic selfies mlkshk kombucha migas edison bulb 8-bit blue bottle. 
            Keffiyeh kickstarter quinoa, vibecession umami schlitz venmo gentrify seitan tote bag hot chicken grailed. 
            Narwhal fam swag vexillologist.
           </p>
           <button className='btn btn-hero' onClick={() => {
            navigate('/register');
           }}>Login/Register</button>
        </div>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
    </Wrapper>
  )
}

export default Landing


// import main from '../assets/images/main.svg';
// import Wrapper from '../assets/wrappers/LandingPage';
// import Logo from '../components/Logo';
// import { Link } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';
// import { useAppContext } from '../context/appContext';
// import React from 'react';

// const Landing = () => {
//   const { user } = useAppContext();
//   return (
//     <React.Fragment>
//       {user && <Navigate to='/' />}
//       <Wrapper>
//         <nav>
//           <Logo />
//         </nav>
//         <div className='container page'>
//           {/* info */}
//           <div className='info'>
//             <h1>
//               job <span>tracking</span> app
//             </h1>
//             <p>
//               I'm baby wayfarers hoodie next level taiyaki brooklyn cliche blue
//               bottle single-origin coffee chia. Aesthetic post-ironic venmo,
//               quinoa lo-fi tote bag adaptogen everyday carry meggings +1 brunch
//               narwhal.
//             </p>
//             <Link to='/register' className='btn btn-hero'>
//               Login/Register
//             </Link>
//           </div>
//           <img src={main} alt='job hunt' className='img main-img' />
//         </div>
//       </Wrapper>
//     </React.Fragment>
//   );
// };

// export default Landing;
