import { memo, useCallback, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { useNavigate, useParams } from 'react-router-dom';
import { BsQuestionOctagonFill } from 'react-icons/bs';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { Input } from './Input';
import { Button } from './Button';
// Sources
import Swal from 'sweetalert2';
import { transformToOptions } from '../helpers/functions';

interface NewUserData {
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

interface Props {
    onCreate?: (user: NewUserData) => Promise<void>
    onEdit?: (user: EditUserData) => Promise<void>
}

interface Role {
    Id: string
    Name: string
}

interface GetRolesData {
    roles: Array<Role>;
    cod: string;
}

function FormForUser({ onCreate, onEdit }: Props) {
    const { addToastr } = useAppStates();
    const { getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState<string>('');
    const [role, setRole] = useState<any>('');
    const [name, setName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [document, setDocument] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [emailConfirm, setEmailConfirm] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>('');
    const [phoneConfirm, setPhoneConfirm] = useState<boolean>(false);
    const [birthDate, setBirthDate] = useState<string>('');
    const [gender, setGender] = useState<any>('Hombre');
    const [active, setActive] = useState(true);
    const [optsRole, setOptsRole] = useState<Array<Role>>([]);
    const optsGender = [
        {'Id': 'Hombre', 'Name': 'Hombre'},
        {'Id': 'Mujer', 'Name': 'Mujer'}
    ]
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    const getUser = useCallback(async () => {
        try {
            const data = await getApiData(`User/GetUserById?User_Id=${params.id}`, true);
            setRole(data.user.role);
            setImage(data.user.imageUrl);
            setName(data.user.name);
            setUserName(data.user.user);
            setPassword(data.user.password);
            setDocument(data.user.document);
            setEmail(data.user.email);
            setEmailConfirm(data.user.emailConfirm);
            setPhone(data.user.phone);
            setPhoneConfirm(data.user.phoneConfirm);
            setBirthDate(data.user.birthDayDate.split('T')[0]);
            setGender(data.user.gender);
            setActive(data.user.active);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/settings/users');
        }
    }, [getApiData, params, addToastr, navigate]);

    const getRoles = useCallback(async () => {
        if (optsRole.length !== 0) {
            return;
        }
        try {
            const data: GetRolesData = await getApiData('Role/GetRoles', true);
            if (!data.roles.length) {
                addToastr('Registra tu primer rol', 'info');
            }                            
            setOptsRole(data.roles);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsRole, addToastr, getApiData]);

    useEffect(() => {
        getRoles();
        if (params.id) {
            getUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--principal)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:#E94040;'>${params.id? 'Editar': 'Crear'}</b> el usuario?</div>`,
            showCancelButton: true,
            confirmButtonColor: '#E94040',
            confirmButtonText: params.id? 'Editar': 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {    
            if (params.id) {
                const user: EditUserData = {
                    'User_Id': params.id!,
                    'Role_Id': role.value,
                    'Image': image,
                    'Name': name,
                    'UserName': userName,
                    'Password': password,
                    'Document': document,
                    'Email': email,
                    'EmailConfirm': emailConfirm,
                    'Phone': phone,
                    'PhoneConfirm': phoneConfirm,
                    'BirthDate': birthDate,
                    'Gender': gender.value,
                    'Active': active,
                }
                if (onEdit) onEdit(user);                 
            } else {
                const user: NewUserData = {
                    'Role_Id': role.value,
                    'Image': image,
                    'Name': name,
                    'UserName': userName,
                    'Password': password,
                    'Document': document,
                    'Email': email,
                    'EmailConfirm': emailConfirm,
                    'Phone': phone,
                    'PhoneConfirm': phoneConfirm,
                    'BirthDate': birthDate,
                    'Gender': gender.value,
                    'Active': active,
                }
                if (onCreate) onCreate(user);
            }
        }
    }, [params, onEdit, onCreate, role, image, name, userName, password, document, email, emailConfirm, phone, phoneConfirm, birthDate, gender, active, MemoizedBsQuestionOctagonFill]);

    return (
        <form className='form_inputs' onSubmit={handleSubmit}>
            <Input type='photo' value={image} setValue={setImage} name='Imagen' required={false} />
            <Input type='select' value={role} setValue={setRole} name='Rol' options={transformToOptions(optsRole)} defaultValue={role} /> 
            <Input type='text' value={name} setValue={setName} name='Nombre' />
            <Input type='text' value={userName} setValue={setUserName} name='Nombre de usuario' />
            <Input type='password' value={password} setValue={setPassword} name='Contraseña' required={params.id?false:true} />
            <Input type='text' value={document} setValue={setDocument} name='Documento' />
            <Input type='email' value={email} setValue={setEmail} name='Email' />
            <Input type='checkbox' value={emailConfirm} setValue={setEmailConfirm} name='Email confirmado' />
            <Input type='tel' value={phone} setValue={setPhone} name='Teléfono' />
            <Input type='checkbox' value={phoneConfirm} setValue={setPhoneConfirm} name='Teléfono confirmado' />
            <Input type='date' value={birthDate} setValue={setBirthDate} name='Cumpleaños' />
            <Input type='select' value={gender} setValue={setGender} name='Genero' options={transformToOptions(optsGender)} defaultValue={gender} />
            <Input type='checkbox' value={active} setValue={setActive} name='Usuario activo' />

            <Button name={params.id? 'Editar usuario' : 'Crear usuario'} type='submit' icon='next' />
        </form>
    );
}

export { FormForUser };