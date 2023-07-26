import React from 'react';
import Select from 'react-select';

// Styles
import '../styles/Input.css'
// Sources
import { v4 as uuidv4 } from 'uuid';

function Input({ name, type, onChange, accept, required = true, disabled, value, setValue, autoComplete = 'off', min, max, options, multiSelect, defaultValue, isSearchable = true }) {
    const id = uuidv4();
    const [imageIsOld, setImageIsOld] = React.useState(true);
	const [typeOf, setTypeOf] = React.useState(type);
	const [subType, setSubType] = React.useState('');
	const menuPortalTarget = document.body;

	const changeValueToCurrency = React.useCallback( () => {
		const cleanValue = value.toString().replace(/[^0-9]/g, '');
		const formattedValue = `$ ${cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
		setValue(formattedValue);
	}, [value, setValue]);

	React.useEffect( () => {
		if (type === 'money') {
			setSubType(type);
			setTypeOf('text');
			changeValueToCurrency();
		}
		if (defaultValue && typeof value !== 'object') {
			const newValue = transformOptions(options).filter( opt => opt.value === defaultValue);
			setValue(newValue[0]);
		} 
		
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

	const handleChange = (e) => {
		if (subType === 'money') {			
			const cleanValue = e.target.value.replace(/[^0-9]/g, '');
			const formattedValue = `$ ${cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
			setValue(formattedValue);
		} else {
			if (!e) e = [];
			setValue( 
				typeOf === 'checkbox' ? e.target.checked : 
				typeOf === 'file' ? e.target.files[0] : 
				typeOf === 'select' ? e : 
				e.target.value 
			);
		}
		
        if (typeOf === 'file' && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function(event) {
				const image = new Image();
				image.onload = function() {
					const width = this.width;
					const height = this.height;			
					// Calcular el tamaño del cuadrado
					const size = Math.min(width, height);
					// Crear un lienzo de imagen cuadrada
					const canvas = document.createElement('canvas');
					canvas.width = size;
					canvas.height = size;
					const ctx = canvas.getContext('2d');			
					// Calcular las coordenadas de recorte
					const x = width > height ? (width - size) / 2 : 0;
					const y = height > width ? (height - size) / 2 : 0;
					// Recortar y redimensionar la imagen en el lienzo
					ctx.drawImage(image, x, y, size, size, 0, 0, size, size);
					// Obtener el archivo de imagen en formato blob
					canvas.toBlob((blob) => {
						const file = new File([blob], e.target.files[0].name, { type: 'image/jpeg' });
						setValue(file);
					}, 'image/jpeg', 0.9);
				};			
				image.src = event.target.result;
            };          
            reader.readAsDataURL(e.target.files[0]);
			setImageIsOld(false);			
        }

        if (onChange) onChange(e);        
    }

	const handleClick = () => {
		document.getElementById(id).click();
	};

	const transformOptions = options => {
		return options.map( option => {
			return {
				value: option.Id,
				label: option.Name,
				complete: option
			};
		});
	};
	
	const customStyles = {
		control: (provided) => ({
			...provided,
			display: 'block',
			width: '100%',
			height: '56px',
			background: 'var(--inputs)',
			color: 'var(--dark)',
			border: 'none',
			boxShadow: 'none',
			outline: 'none',
			borderRadius: '2vh',
			textAlign: 'center',
			fontSize: '1rem',
			padding: '0 2vh',
			display: 'flex'
		}),
	};

    return (
		<>
			{typeOf === 'file' ?
			 	<div className='image_body'>
					<div className='image_container' id={id+'_imageContainer'} onClick={handleClick}>
						{value && <img className='uploaded_image' src={imageIsOld ? value : URL.createObjectURL(value)} alt='Imagen seleccionada' width='210px' height='210px' />}
					</div>
					<p className='image_description'>Tamaño recomendado (300x300). Formatos (JPG, JPEG, PNG).</p>
				</div>
			:
                null
            }
			<div className='input_field'>
				<label className='field_name' htmlFor={id} >{name}</label>
				<div className={typeOf === 'checkbox'?'field_type_slider':''}>
					{typeOf === 'select'?
						<Select
							styles={customStyles}
							id={id}
							onChange={handleChange}
							options={transformOptions(options)}
							isDisabled={disabled}
							required={required}
							isMulti={multiSelect}
							value={value}
							defaultValue={defaultValue ? transformOptions(options).filter(opt => opt.value === defaultValue) : null}
							isClearable
							name={name.replaceAll(' ', '-')}
							placeholder={name}
							noOptionsMessage={() => `Sin resultados de ${name}`}
							closeMenuOnSelect={multiSelect ? false : true}
							tabSelectsValue
							menuPortalTarget={menuPortalTarget}
							isSearchable={isSearchable}
						/>
					: typeOf === 'textarea' ?
                        <textarea
                            className='field_type_textarea'
                            id={id}
                            name={name.replaceAll(' ', '-')}
                            onChange={handleChange}
                            value={value}
                            placeholder={name}
                            required={required}
                            disabled={disabled}
                        ></textarea>
                    :
						<input
							className={typeOf !== 'checkbox'?'field_type_input':''}
							id={id}
							name={name.replaceAll(' ','-')}
							type={typeOf}
							onChange={handleChange}
							value={typeOf === 'file' ? undefined : value}
							checked={typeOf === 'checkbox' ? value : null}                
							placeholder={name}
							accept={accept||undefined}
							required={typeOf === 'checkbox'? false : required}
							disabled={disabled}
							autoComplete={autoComplete}
							min={min}
							max={max}
						/>
					}
					{typeOf === 'checkbox'? <label htmlFor={id}></label> : null}
				</div>
			</div>
		</>
    );
}

export { Input };