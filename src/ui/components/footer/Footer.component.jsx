import { Layout } from 'antd';
const { Footer } = Layout;

export const FooterComponent = () => {
  return (
    <Footer
      style={{
        textAlign: 'center',
      }}
    >
      {`Grupo Farsiman  ${new Date().getFullYear()}`}
    </Footer>
  );
};
