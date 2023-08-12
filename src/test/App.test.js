import { render, screen } from '@testing-library/react';
import {AppUi} from '../components/AppUi';
import dotenv from 'dotenv';

dotenv.config();

test('renders learn react link', () => {
	render(<AppUi />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
