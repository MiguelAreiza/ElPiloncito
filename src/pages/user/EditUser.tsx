import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Header } from '../../components/Header';
import { FormForUser } from '../../components/FormForUser'
// Sources
import imgUsers from '../../assets/images/headerOptions/Users.svg';

interface EditUserData {
    User_Id: string
    Role_Id: string | Array<any>
    Image: string
    Name: string
    UserName: string
    Password: string
    Document: string
    Email: string
    EmailConfirm: boolean
    Phone: string
    PhoneConfirm: boolean
    BirthDate: string
    Gender: 'Hombre'|'Mujer'
    Active: boolean
}

function EditUser() {    
    const { addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        setMenuConfig({
            path: '/home/settings/users',
            option: 'settings'
        });
    }, [setMenuConfig]);
    
    const handleEditUser = useCallback(async (user: EditUserData) => {
        try {
            const body = new FormData();
            body.append('User_Id', user.User_Id);
            body.append('Role_Id', user.Role_Id.toString());
            body.append('Image', user.Image!);
            body.append('Name', user.Name);
            body.append('UserName', user.UserName);
            body.append('Password', user.Password);
            body.append('Document', user.Document);
            body.append('Email', user.Email);
            body.append('EmailConfirm', user.EmailConfirm.toString());
            body.append('Phone', user.Phone);
            body.append('PhoneConfirm', user.PhoneConfirm.toString());
            body.append('BirthDate', user.BirthDate);
            body.append('Gender', user.Gender);
            body.append('Active', user.Active.toString());
            const data: ResponseApi = await postApiData('User/UpdateUser', body, true, 'multipart/form-data');
            addToastr(data.rpta);
            navigate('/home/settings/users');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [postApiData, addToastr, navigate]);

    return (
        <div className='page_container'>
            <Header logo={imgUsers} title='Usuario' />
            <FormForUser onEdit={handleEditUser} />
        </div>
    );
}

export { EditUser };