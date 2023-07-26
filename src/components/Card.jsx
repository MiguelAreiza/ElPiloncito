import React from 'react';
import { TbEdit } from 'react-icons/tb';
import { TiDelete } from 'react-icons/ti';
import { BiBadgeCheck } from 'react-icons/bi';

// Styles
import '../styles/Card.css'

function Card({ onEdit, onDelete, canEdit, canSee, canDelete, name, isOrderProduct, quantity, total, remarks }) {
    const valueToCurrency = (value) => {
		const cleanValue = value.toString().replace(/[^0-9]/g, '');
		const formattedValue = `$ ${cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
		return formattedValue;
	};

    return (
        <>
        {
            isOrderProduct ?
                <div className='card_body order'>                    
                    <h4 className='card_title order' >{name}</h4>
                    <h5 className='card_quantity order'>x{quantity}</h5>
                    <h6 className='card_total order'>{valueToCurrency(total)}</h6>
                    <p className='card_remarks order'>{remarks}</p>                    
                    <div className='card_options order'>
                        { canEdit && <TbEdit className='option_edit' onClick={onEdit} size={27} />}
                        { canSee && <BiBadgeCheck className='option_see' size={27} />}
                        { canDelete && <TiDelete className='option_delete' onClick={onDelete} size={27} />}
                    </div>
                </div>
            :
                <div className='card_body'>
                    <h4 className='card_title' >{name}</h4>
                    <div className='card_options'>
                        { <TbEdit className='option_edit' onClick={onEdit} size={27} />}
                        { <BiBadgeCheck className='option_see' size={27} />}
                        { <TiDelete className='option_delete' onClick={onDelete} size={27} />}
                    </div>
                </div>

            /* <img className='product_image' src={image||defaultImage} alt='Foto del producto' draggable='false' width='250px' height='250px' />
            <div className='product_details'>
                <label className='product_name'>{name ? name : '--'} {!name && <br />} {!name && '--'}</label>
                <p className='product_description'>{description||'--'}</p>
                <label className='product_price'>$ {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '--'}</label>
            </div>
            <div className='card_options'>
                <button onClick={onEdit} className='option_edit'>Editar</button>
                <button onClick={onDelete} className='option_delete'>Eliminar</button>
            </div> */
        }
        </>
    );
}

export { Card };