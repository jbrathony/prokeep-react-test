import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';

// Mock the axios module
jest.mock('axios');

describe('LoginForm', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('handles valid login', async () => {
        const { getByLabelText, getByText, queryByText } = render(<LoginForm />);
        const emailInput = getByLabelText('Email:');
        const passwordInput = getByLabelText('Password:');
        const submitButton = getByText('Login');

        // Mock a successful POST request
        axios.post.mockResolvedValueOnce({ data: { token: 'dummyToken' } });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Wait for the async POST request to complete
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'https://reqres.in/api/login',
                {
                    email: 'test@example.com',
                    password: 'password123',
                }
            );
        });

        // Expect that the error message is not displayed
        expect(queryByText('Invalid email address')).toBeNull();
    });

    it('handles invalid email', () => {
        const { getByLabelText, getByText, queryByText } = render(<LoginForm />);
        const emailInput = getByLabelText('Email:');
        const passwordInput = getByLabelText('Password:');
        const submitButton = getByText('Login');

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Expect that the error message is displayed
        expect(queryByText('Invalid email address')).toBeInTheDocument();
    });

    it('handles login failure', async () => {
        const { getByLabelText, getByText, queryByText } = render(<LoginForm />);
        const emailInput = getByLabelText('Email:');
        const passwordInput = getByLabelText('Password:');
        const submitButton = getByText('Login');

        // Mock a failed POST request
        axios.post.mockRejectedValueOnce(new Error('Login failed'));

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Wait for the async POST request to complete
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'https://reqres.in/api/login',
                {
                    email: 'test@example.com',
                    password: 'password123',
                }
            );
        });

        // Expect that the error message is displayed
        expect(queryByText('Login failed. Please try again.')).toBeInTheDocument();
    });
});
