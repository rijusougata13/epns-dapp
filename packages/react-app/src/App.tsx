import React from "react";
import ReactGA from "react-ga";
import { ToastContainer } from "react-toastify";
import { Web3Provider } from "ethers/providers";
import { useWeb3React } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useEagerConnect, useInactiveListener } from "hooks";
import { envConfig } from "@project/contracts";
import { injected, walletconnect, portis, ledger } from "connectors";
import Home from "pages/Home";
import Header from "segments/Header";
import styled from "styled-components";
import { Item, ItemH, Span, H2, B, A,C } from "components/SharedStyling";
import UnderProgressModal from './components/UnderProgressModal';
import "react-toastify/dist/ReactToastify.min.css";
import TimerComponent from './segments/TimerComponent';
import countdown from './config/countdown';
import * as dotenv from "dotenv";
dotenv.config();

// define the different type of connectors which we use
const web3Connectors = {
  Injected: {
    obj: injected,
    logo: "./svg/login/metamask.svg",
    title: "MetaMask",
  },
  WalletConnect: {
    obj: walletconnect,
    logo: "./svg/login/walletconnect.svg",
    title: "Wallet Connect",
  },
  // Trezor: {obj: trezor, logo: './svg/login/trezor.svg', title: 'Trezor'},
  // Ledger: { obj: ledger, logo: "./svg/login/ledger.svg", title: "Ledger" },
  Portis: { obj: portis, logo: "./svg/login/portis.svg", title: "Portis" },
};

export default function App() {
  const { connector, activate, active, error } = useWeb3React<Web3Provider>();
  const [activatingConnector, setActivatingConnector] = React.useState<
    AbstractConnector
  >();
  const [currentTime,setcurrentTime]=React.useState(0);
  

  React.useEffect(()=>{
    const now = Date.now()/ 1000;
    setcurrentTime(now)
  },[])
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);
  // Initialize GA
  ReactGA.initialize(envConfig.googleAnalyticsId);
  ReactGA.pageview("/login");
  
  // Production 
  console.log = function(){}
  return (
    <>
    
      <HeaderContainer>
        <Header/>
      </HeaderContainer>

      <ParentContainer>
        
        {active && !error && (
          <HomeContainer>

            <Home />
          </HomeContainer>
        )}

        {!active && (
          <Item>
            {/* <UnderProgressModal/> */}

            <ProviderLogo
              src="./epnshomelogo.png"
              srcSet={"./epnshomelogo@2x.png 2x, ./epnshomelogo@2x.png 3x"}
            />
            <Item
              bg="#fafafa"
              border="1px solid #ddd"
              padding="15px"
              radius="12px"
            >
              <H2 textTransform="uppercase" spacing="0.1em">
                <Span bg="#e20880" color="#fff" weight="600" padding="0px 8px">
                  Connect
                </Span>
                <Span weight="200"> Your Wallet</Span>
              </H2>

              <ItemH maxWidth="800px" align="stretch">
                {Object.keys(web3Connectors).map((name) => {
                  const currentConnector = web3Connectors[name].obj;
                  const connected = currentConnector === connector;
                  const disabled =
                    !triedEager ||
                    !!activatingConnector ||
                    connected ||
                    !!error;
                  const image = web3Connectors[name].logo;
                  const title = web3Connectors[name].title;

                  return (
                    <ProviderButton
                      disabled={disabled}
                      key={name}
                      onClick={() => {
                        setActivatingConnector(currentConnector);
                        activate(currentConnector);
                      }}
                      border="#35c5f3"
                    >
                      <ProviderImage src={image} />

                      <Span
                        spacing="0.1em"
                        textTransform="uppercase"
                        size="12px"
                        weight="600"
                        padding="10px"
                      >
                        {title}
                      </Span>
                    </ProviderButton>
                  );
                })}
              </ItemH>
            </Item>

            <Span margin="10px" size="14px">
              By unlocking your wallet, <B>You agree</B> to our{" "}
              <A href="https://epns.io/tos" target="_blank">
                Terms of Service
              </A>{" "}
              and our{" "}
              <A href="https://epns.io/privacy" target="_blank">
                Privacy Policy
              </A>
              .
            </Span>
            <Item
              bg="#fafafa"
              border="1px solid #ddd"
              padding="30px 15px"
              radius="12px"
              width="50rem"
            >
              <StyledItem>
              <span> Note: </span> The EPNS protocol has been under development for 1+ year,  and completed a <C href="https://epns.io/EPNS-Protocol-Audit2021.pdf" target="_blank"> ChainSafe audit </C> in October 2021. However, the mainnet is still a new product milestone.  Always DYOR, and anticipate bugs and UI improvements.  Learn how to report any bugs in our  <C href="https://discord.com/invite/YVPB99F9W5" target="_blank">Discord.</C>
              </StyledItem>
            </Item>
          </Item>
        )}
      </ParentContainer>

      <ToastContainer
        position="bottom-right"
        autoClose={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </>
  );
}

// CSS STYLES
const StyledItem = styled(Item)`
  font-size: 14px;
  letter-spacing: 0.4px;
  display: block;
  span{
    color: #e20880;
  }
`;
const HeaderContainer = styled.header`
  left: 0;
  right: 0;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
`;

const ParentContainer = styled.div`
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 80px 20px 50px 20px;
  flex: 1;
`;

const HomeContainer = styled.div`
  display: flex;
  flex: 1;
  align-self: center;
  width: 100%;
  max-width: 1100px;
`;

const ProviderLogo = styled.img`
  width: 15vw;
  align-self: center;
  display: flex;
  margin: 10px 20px 20px 20px;
  min-width: 200px;
`;

const ProviderButton = styled.button`
  flex: 1 1 0;
  min-width: 280px;
  background: #fff;
  outline: 0;

  box-shadow: 0px 15px 20px -5px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  border: 1px solid rgb(225, 225, 225);

  margin: 20px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  display: flex;
  flex-direction: row;
  padding: 10px;

  &:hover {
    opacity: 0.9;
    cursor: pointer;
    border: 1px solid ${(props) => props.border};
  }
  &:active {
    opacity: 0.75;
    cursor: pointer;
    border: 1px solid ${(props) => props.border};
  }
`;

const ProviderImage = styled.img`
  width: 32px;
  max-height: 32px;
  padding: 10px;
`;

const ProviderLabel = styled.span`
  font-size: 12px;
  margin: 5px;
`;

const StyledContainer = styled(ToastContainer).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
  }
  .Toastify__toast-body {
    font-size: 12px;
  }
  .Toastify__progress-bar {
  }
`;
