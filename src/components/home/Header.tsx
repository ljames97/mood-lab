// Header.tsx

import Logo from "./Logo";
import ProfilePhoto from "./ProfilePhoto";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-8 px-8 bg-primary-darkest">
      <Logo />
      {/* <div className="flex rounded-full bg-white p-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#4C1D3D" version="1.1" id="Capa_1" width="16px" height="16px" viewBox="0 0 45.402 45.402">
          <g>
            <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
          </g>
        </svg>
      </div> */}
      <svg className="ml-auto mr-2" width="45" height="45" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.235 9.19a1.5 1.5 0 1 1 .448-2.966 1.5 1.5 0 0 1-.448 2.966zM14.235 8.99a1.5 1.5 0 1 1 .448-2.966 1.5 1.5 0 0 1-.448 2.966zm2.317 3.2A1.5 1.5 0 1 1 17 9.224a1.5 1.5 0 0 1-.448 2.966z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.586 3v.015c4.749.06 8.63 3.52 8.63 7.854a5.202 5.202 0 0 1-5.195 5.195H14.44a.575.575 0 0 0-.435.962 2.085 2.085 0 0 1-1.542 3.478h-.005a8.755 8.755 0 0 1 0-17.5l.13-.004zM7.51 6.73a7.255 7.255 0 0 1 4.955-2.216c4.035.001 7.242 2.88 7.242 6.355a3.693 3.693 0 0 1-3.685 3.695h-1.58a2.084 2.084 0 0 0-1.554 3.458l.007.007a.576.576 0 0 1-.428.985A7.255 7.255 0 0 1 7.509 6.73z" fill="white"></path></svg>
      <ProfilePhoto />
    </div>

  )
}