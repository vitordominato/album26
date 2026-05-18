import type { SVGProps } from 'react';

/**
 * Silhueta da garrafa contour, ícone genérico para identificar
 * o espaço Coca-Cola do álbum. Não usa a marca registrada — apenas
 * a forma característica de garrafa de refrigerante.
 */
export function CocaColaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 2h6v2.2c0 .6.3 1.2.8 1.6.9.7 1.7 1.6 1.7 3v10.6c0 1.4-.8 2.3-1.7 3-.5.4-.8 1-.8 1.6V22H9v-.0c0-.6-.3-1.2-.8-1.6C7.3 19.7 6.5 18.8 6.5 17.4V6.8c0-1.4.8-2.3 1.7-3 .5-.4.8-1 .8-1.6V2Z" />
      <path d="M6.5 11h11" />
      <path d="M6.5 15h11" />
    </svg>
  );
}
