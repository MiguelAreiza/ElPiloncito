import React from 'react';
import { render, screen } from '@testing-library/react';
import { Categories } from '../pages/category/Categories';
import dotenv from 'dotenv';

dotenv.config();

describe('Categories Component', () => {
    it('renders without errors', () => {
        render(<Categories />);
        // Verifica si el componente se renderiza sin errores
    });

    it('displays categories correctly', () => {
        const categoriesData = [
            { Id: 1, Name: 'Category 1' },
            { Id: 2, Name: 'Category 2' }
        ];
        jest.mock('../helpers/api', () => ({
            useApi: () => ({
                getApiData: jest.fn().mockResolvedValue({ categories: categoriesData }),
                postApiData: jest.fn()
            })
        }));
        
        render(<Categories />);
        
        // Verifica si las categorías se muestran correctamente en el componente
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    // Agrega más pruebas aquí según tus necesidades
});