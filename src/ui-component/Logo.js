import logo from 'assets/images/Logo.png';

const Logo = () => {
  return (
    <img
      src={logo}
      alt="Logo Bienestar Sin Dolor"
      style={{
        backgroundSize: 'cover',
        width: 50
      }}
    />
  );
};

export default Logo;
