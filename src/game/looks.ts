export type HairStyle = "spiky" | "messy" | "long" | "bob" | "twin";
export type Accessory =
  | "headphones"
  | "beret"
  | "shades"
  | "ribbon"
  | "catears"
  | "none";

export interface Look {
  name: string;
  skin: string;
  hair: string;
  hairShade: string;
  eyes: string;
  outfit: string;
  outfit2: string;
  style: HairStyle;
  acc: Accessory;
}

export const LOOKS: Look[] = [
  { name: "Ren", skin: "#FBE3D3", hair: "#34303d", hairShade: "#16141b", eyes: "#7a55b8", outfit: "#F4F1EE", outfit2: "#E8763A", style: "spiky", acc: "headphones" },
  { name: "Sakura", skin: "#FDE6DA", hair: "#F6AFC0", hairShade: "#D9798F", eyes: "#C2477A", outfit: "#7A5236", outfit2: "#B33A4A", style: "long", acc: "beret" },
  { name: "Kaito", skin: "#F8DFCF", hair: "#E9E7EF", hairShade: "#B2AEC2", eyes: "#3E6FB0", outfit: "#2E2A2B", outfit2: "#F2A0B8", style: "messy", acc: "shades" },
  { name: "Mio", skin: "#FDE8DC", hair: "#7650C9", hairShade: "#4A2F91", eyes: "#2FA597", outfit: "#4C6FD1", outfit2: "#FFFFFF", style: "twin", acc: "ribbon" },
  { name: "Yuki", skin: "#FCE9E0", hair: "#A3D8F2", hairShade: "#5FA9D3", eyes: "#2B7FBF", outfit: "#FFFFFF", outfit2: "#7FC6E8", style: "bob", acc: "catears" },
  { name: "Haru", skin: "#F3D2BC", hair: "#C9603A", hairShade: "#8E3A1C", eyes: "#C27B1F", outfit: "#3D7A5A", outfit2: "#F4E3B8", style: "spiky", acc: "none" },
  { name: "Aoi", skin: "#FDE4D6", hair: "#26457F", hairShade: "#122550", eyes: "#E26D5A", outfit: "#F1C04B", outfit2: "#2C2C2C", style: "long", acc: "ribbon" },
  { name: "Kuro", skin: "#F6DCCB", hair: "#F2D27A", hairShade: "#C9A447", eyes: "#5A3E9C", outfit: "#8E4FB8", outfit2: "#FFFFFF", style: "messy", acc: "headphones" },
  { name: "Hina", skin: "#FDE8DE", hair: "#8B5A3C", hairShade: "#5C3824", eyes: "#4E8A3A", outfit: "#F7B7C9", outfit2: "#FFFFFF", style: "bob", acc: "beret" },
];
