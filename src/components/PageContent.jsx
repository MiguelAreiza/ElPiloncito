import React from 'react';

// Styles
import '../styles/PageContent.css';

function PageContent({children}) {
    return (           
        <main className='pageContent'>
            {children}
        </main>
    );
}

export { PageContent };