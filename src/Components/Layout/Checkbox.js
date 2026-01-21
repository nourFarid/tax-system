import React from 'react';
import styled from 'styled-components';

const Checkbox = ({ checked, onChange, id, name, label, disabled = false }) => {
    return (
        <StyledWrapper>
            <label className="container">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    id={id}
                    name={name}
                    disabled={disabled}
                />
                <div className="checkmark" />
                {label && <span className="label-text">{label}</span>}
            </label>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  /* Hide the default checkbox */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
    font-size: 1rem;
    user-select: none;
  }

  .label-text {
    font-size: 0.95rem;
    color: #333;
    font-weight: 500;
  }

  /* Create a custom checkbox */
  .checkmark {
    --clr: #5DADE2;
    position: relative;
    top: 0;
    left: 0;
    height: 1.3em;
    width: 1.3em;
    background-color: #e2e8f0;
    border-radius: 50%;
    transition: 300ms;
    flex-shrink: 0;
  }

  /* When the checkbox is checked, add a blue background */
  .container input:checked ~ .checkmark {
    background-color: var(--clr);
    border-radius: .5rem;
    animation: pulse 500ms ease-in-out;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .container .checkmark:after {
    left: 0.45em;
    top: 0.25em;
    width: 0.25em;
    height: 0.5em;
    border: solid #ffffff;
    border-width: 0 0.15em 0.15em 0;
    transform: rotate(45deg);
  }

  /* Disabled state */
  .container input:disabled ~ .checkmark {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .container input:disabled ~ .label-text {
    opacity: 0.5;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 #5DADE290;
      rotate: 20deg;
    }

    50% {
      rotate: -20deg;
    }

    75% {
      box-shadow: 0 0 0 10px #5DADE260;
    }

    100% {
      box-shadow: 0 0 0 13px #5DADE230;
      rotate: 0;
    }
  }
`;

export default Checkbox;
