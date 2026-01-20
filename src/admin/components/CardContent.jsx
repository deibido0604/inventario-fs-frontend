import { theme } from 'antd';

export const CardContent = ({children}) => {

      const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
       <div
            style={{
              padding: 24,
              minHeight: 20,
              marginBottom:20,
              background: colorBgContainer,
            }}
    >
      {children}
          </div>
  )
}
