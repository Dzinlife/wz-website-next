const Wz: React.FC<{
  color: string;
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
  className?: string;
}> = ({ color, height, width, style, className }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 624 467"
      style={style}
      className={className}
    >
      <path
        fill={color}
        d="M532.546323,224.522445 L623.503343,-0.425023878 L549.172875,-0.425023878 L458.215855,224.522445 L532.546323,224.522445 Z M557.975167,224.522445 L614.701051,224.522445 L614.701051,180.510984 C601.986628,197.137536 581.447947,212.786055 557.975167,224.522445 Z M522.765998,-0.425023878 L460.17192,-0.425023878 L460.17192,43.5864374 C474.842407,24.025788 496.359121,8.37726839 522.765998,-0.425023878 Z M215.663801,-0.425023878 L298.796562,-0.425023878 L461.149952,401.546323 C450.391595,427.9532 427.896848,452.404011 404.424069,466.096466 L215.663801,-0.425023878 Z M0.496657116,-0.425023878 L83.6294174,-0.425023878 L245.982808,401.546323 C235.224451,427.9532 212.729704,452.404011 189.256925,466.096466 L0.496657116,-0.425023878 Z"
      ></path>
    </svg>
  );
};

export default Wz;
