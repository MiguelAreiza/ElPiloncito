import React from 'react';

// Styles
import '../styles/PageContent.css';

function PageContent({children}) {
    return (           
        <main className='page_content'>
            {children}
        </main>
    );
}

export { PageContent };