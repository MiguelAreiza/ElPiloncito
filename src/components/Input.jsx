import React from 'react';

// Styles
import '../styles/Input.css'
// Sources
import { v4 as uuidv4 } from 'uuid';

function Input({ name, type, onChange, accept, required = true, disabled, value, setValue, options }) {
    const id = uuidv4();
    const [imageIsOld, setImageIsOld] = React.useState(true);
	const [typeOf, setTypeOf] = React.useState(type);
	const [subType, setSubType] = React.useState('');

	const changeValue =	React.useCallback( () => {
		const cleanValue = value.toString().replace(/[^0-9]/g, '');
		const formattedValue = `$ ${cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
		setValue(formattedValue);
	}, [value, setValue]);

	React.useEffect( () => {
		if (type === 'money') {
			setSubType(type);
			setTypeOf('text');
			changeValue();
		}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

	const handleChange = (e) => {

		if (subType === 'money') {			
			const cleanValue = e.target.value.replace(/[^0-9]/g, '');
			const formattedValue = `$ ${cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
			setValue(formattedValue);
		} else {
			setValue( typeOf === 'checkbox' ? e.target.checked : typeOf === 'file' ? e.target.files[0] : e.target.value );
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

    return (
		<>
			{typeOf === 'file' ?
			 	<>
					<div className='container_image' id={id+'_imageContainer'} onClick={handleClick}>
						{value && <img className='imageSelected' src={imageIsOld ? value : URL.createObjectURL(value)} alt='Imagen seleccionada' width='210px' height='210px' />}
					</div>
					<label className='description_image'>Tamaño recomendado (300x300). Formatos (JPG, JPEG, PNG).</label>
				</>
			:
				null
			}
			<div className='field'>
				<label className='field_name'>{name}</label>
				<div className={typeOf === 'checkbox'?'field_input_slider':''}>
					{typeOf === 'select'?
						<select 
							className='field_input'
							name={name.replaceAll(' ','-')}
							onChange={handleChange}
							value={value}
							required={required}
							disabled={disabled}>
								<option value=''>Seleccione una {name}</option>
								{
									options.map( (opt) => {
										return( 
											<option key={opt.id} value={opt.id}>{opt.strName}</option>
										)
									})
								}
						</select>
					:
						<input
							className={typeOf !== 'checkbox'?'field_input':''}
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
						/>
					}
					{typeOf === 'checkbox'? <label htmlFor={id}></label> : null}
				</div>
			</div>
		</>
    );

}

export { Input };