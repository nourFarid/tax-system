import React from 'react';
import styled from 'styled-components';

const Switch = ({ checked, onChange, id, disabled = false, size = 'medium' }) => {
    return (
        <StyledWrapper size={size}>
            <label className="switch">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
                <span className="slider"></span>
            </label>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .switch {
    --width: ${props => props.size === 'small' ? '44px' : props.size === 'large' ? '60px' : '52px'};
    --height: ${props => props.size === 'small' ? '24px' : props.size === 'large' ? '32px' : '28px'};
    --slider-size: ${props => props.size === 'small' ? '18px' : props.size === 'large' ? '26px' : '22px'};
    --slider-offset: 3px;
    
    position: relative;
    display: inline-block;
    width: var(--width);
    height: var(--height);
    cursor: pointer;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, #e2e8f0, #cbd5e1);
    border-radius: 34px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: var(--slider-size);
    width: var(--slider-size);
    left: var(--slider-offset);
    bottom: calc((var(--height) - var(--slider-size)) / 2);
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
      0 2px 5px rgba(0, 0, 0, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.1),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
  }

  input:checked + .slider {
    background: linear-gradient(145deg, #22c55e, #16a34a);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  input:checked + .slider:before {
    transform: translateX(calc(var(--width) - var(--slider-size) - var(--slider-offset) * 2));
    box-shadow: 
      0 2px 5px rgba(0, 0, 0, 0.25),
      0 1px 2px rgba(0, 0, 0, 0.1),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
  }

  input:focus + .slider {
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.1),
      0 0 0 3px rgba(34, 197, 94, 0.3);
  }

  input:disabled + .slider {
    opacity: 0.5;
    cursor: not-allowed;
  }

  input:disabled + .slider:before {
    cursor: not-allowed;
  }

  /* Hover effect */
  .switch:hover .slider:before {
    box-shadow: 
      0 3px 8px rgba(0, 0, 0, 0.25),
      0 2px 4px rgba(0, 0, 0, 0.15),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
  }

  /* Active state */
  .switch:active .slider:before {
    width: calc(var(--slider-size) + 4px);
  }

  input:checked + .slider:hover {
    background: linear-gradient(145deg, #16a34a, #15803d);
  }
`;

export default Switch;
