import { Menubar } from "primereact/menubar";

function NavBar() {
  const items = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      url: "/",
    },
    {
      label: "Sobre el Proyecto",
      icon: "pi pi-info",
      url: "/about",
    },
    {
      label: "Documentacion",
      icon: "pi pi-book",
      url: "/documentation",
    },
  ];

  return (
    <div>
      <Menubar model={items} />
    </div>
  );
}

export default NavBar;
