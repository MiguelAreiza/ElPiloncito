import React from 'react';
import { TbEdit } from 'react-icons/tb';
import { TiDelete } from 'react-icons/ti';
import { BiBadgeCheck } from 'react-icons/bi';

// Styles
import '../styles/Card.css'

function Card({ onEdit, onDelete, name }) {
    return (
        <div className='card_body'>
            <h4 className='card_title' >{name}</h4>
            <div className='card_options'>
                <TbEdit className='option_edit' onClick={onEdit} size={27} />
                <BiBadgeCheck className='option_see' size={27} />
                <TiDelete className='option_delete' onClick={onDelete} size={27} />
            </div>
            {/* <img className='product_image' src={image||defaultImage} alt='Foto del producto' draggable='false' width='250px' height='250px' />
            <div className='product_details'>
                <label className='product_name'>{name ? name : '--'} {!name && <br />} {!name && '--'}</label>
                <p className='product_description'>{description||'--'}</p>
                <label className='product_price'>$ {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '--'}</label>
            </div>
            <div className='card_options'>
                <button onClick={onEdit} className='option_edit'>Editar</button>
                <button onClick={onDelete} className='option_delete'>Eliminar</button>
            </div> */}
        </div>
    );
}

export { Card };