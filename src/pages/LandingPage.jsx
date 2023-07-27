import React from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
// Styles
import '../styles/LandingPage.css';
// Sources
import imgBanner from '../assets/images/landingPage/Banner.svg';
import imgSedeLasPlayas from '../assets/images/landingPage/SedeLasPlayas.jpg';
import imgSedeSantaMonica from '../assets/images/landingPage/SedeSantaMonica.jpg';

function LandingPage() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();

    React.useEffect( () => {
        setMenuConfig(() => ({
            active: false
        }));
        setTimeout(() => {
            setIsLoading(false);
            addToastr('Bienvenido');
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleclickDigitalMenu = () =>{        
        window.open('https://piloncito.maddiapp.com');
    }

    const handleclickDeliveries = () =>{
        addToastr('Proximamente activo', 'info');
    }

    const handleclickBookings = () =>{
        addToastr('Proximamente activo', 'info');
    }

    return (
        <div className='landingPage'>
            <Header landingPage />
            <div className='section home_section'>
                <img src={imgBanner} alt='Banner inicio el piloncito' width='500px' height='300px' />
                <div className='fastOptions'>
                    <Button name='Ver la Carta' icon='next'  onClick={handleclickDigitalMenu} />
                    <Button name='Domicilios' icon='next' dark onClick={handleclickDeliveries} />
                    <Button name='Reservas' icon='next' onClick={handleclickBookings} />
                </div>
                <p>¡Bienvenidos al auténtico sabor de la comida rápida en su máxima expresión! <br /><br />
                    En el Restaurante El Piloncito, sabemos que la verdadera esencia de las comidas rápidas radica en la combinación perfecta de ingredientes frescos, sazón inigualable y la rapidez que necesitas. <br />
                    Nuestra aplicación te permitirá descubrir nuestros irresistibles platos, desde hamburguesas jugosas hasta tacos llenos de sabor, realizar tus pedidos con solo unos pocos toques ahora es posible, también puedes hacer tus reservas de manera rápida y sencilla a través de nuestra app <br />
                    ¡Prepárate para satisfacer tus antojos y deleitarte con cada bocado! En El Piloncito, nos enorgullece ofrecerte autenticidad, calidad y el genuino espíritu de las comidas rápidas. ¡Ven y disfruta de una experiencia culinaria auténtica que te hará volver por más!
                </p>
                <Button name='Ver la Carta' icon='next' onClick={handleclickDigitalMenu} />
            </div>
            <div className='section headquarters_section'>
                <h2 className='section_title'>Sedes</h2>
                <div className='headquarter_card'>
                    <div className='headquarter_image'>
                        <img src={imgSedeSantaMonica} alt='Imagen sede santa monica' draggable='false' width='260px' height='260px' />
                    </div>
                    <h3 className='headquarter_title'>Santa monica</h3>
                    <p className='headquarter_address'>Cra. 90#42c-26, Santa Monica, Medellín</p>
                    <a className='headquarter_route' href='https://goo.gl/maps/s2Z8aA17jkyz13SH7' target='_blank' rel='noopener noreferrer'>Cómo llegar</a>
                </div>
                <div className='headquarter_card'>
                    <div className='headquarter_image'>
                        <img src={imgSedeLasPlayas} alt='Imagen sede belen' draggable='false' width='260px' height='260px' />
                    </div>
                    <h3 className='headquarter_title'>Belen las playas</h3>
                    <p className='headquarter_address'>Cra. 72 #18-00, Belén, Medellín</p>
                    <a className='headquarter_route' href='https://goo.gl/maps/AMkgkZ32dAPUq3NY9' target='_blank' rel='noopener noreferrer'>Cómo llegar</a>
                </div>
            </div>
            <div className='section us_section'>
                <h2 className='section_title reverse'>Nosotros</h2>                
                <p>En Piloncito, nos apasiona brindarte una experiencia única y auténtica. Con años de experiencia en la industria, nuestro equipo de talentosos y amantes de la buena comida trabaja incansablemente para ofrecerte los sabores más exquisitos y una atención excepcional. <br /><br />
                    En Piloncito, creemos en la importancia de preservar la tradición culinaria y resaltar los ingredientes frescos y de alta calidad. Cada plato que servimos es cuidadosamente preparado con pasión y creatividad, para brindarte una explosión de sabores en cada bocado.
                </p>
                <Button name='Reservas' icon='next' onClick={handleclickBookings} />
            </div>            
            <div className='section contact_section'>
                <h2 className='section_title'>Contacto</h2>
                <ContactForm />
            </div>
            <Footer />
        </div>
    );

}

export { LandingPage };