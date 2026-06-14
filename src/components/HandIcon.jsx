// A stylized open hand (back of hand, four fingers + thumb) with a
// multi-tone gradient representing many skin tones, and a gold ring
// on the index finger.
export default function HandIcon({ size = 160 }){
  return (
    <svg
      viewBox="0 0 195 185"
      width={size}
      height={size * (185/195)}
      role="img"
      aria-label="Illustration of a hand wearing a ring on the index finger, shown with a gradient spanning many skin tones"
    >
      <defs>
        <linearGradient id="handGradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor="#F6DCC8"/>
          <stop offset="20%"  stopColor="#E8BE96"/>
          <stop offset="40%"  stopColor="#C9925E"/>
          <stop offset="60%"  stopColor="#9C6238"/>
          <stop offset="80%"  stopColor="#6B3F22"/>
          <stop offset="100%" stopColor="#3F2716"/>
        </linearGradient>
      </defs>

      {/* palm */}
      <path d="M 20 100 L 155 100 L 155 165 C 155 176.046 146.046 185 135 185 L 40 185 C 28.954 185 20 176.046 20 165 L 20 100 Z"
            fill="url(#handGradient)" stroke="#3D2B1F" strokeWidth="2"/>
      {/* pinky */}
      <path d="M 38 45 C 45.18 45 51 50.82 51 58 L 51 100 L 25 100 L 25 58 C 25 50.82 30.82 45 38 45 Z"
            fill="url(#handGradient)" stroke="#3D2B1F" strokeWidth="2"/>
      {/* ring finger */}
      <path d="M 70 20 C 77.732 20 84 26.268 84 34 L 84 100 L 56 100 L 56 34 C 56 26.268 62.268 20 70 20 Z"
            fill="url(#handGradient)" stroke="#3D2B1F" strokeWidth="2"/>
      {/* middle finger */}
      <path d="M 103 5 C 110.732 5 117 11.268 117 19 L 117 100 L 89 100 L 89 19 C 89 11.268 95.268 5 103 5 Z"
            fill="url(#handGradient)" stroke="#3D2B1F" strokeWidth="2"/>
      {/* index finger */}
      <path d="M 136 22 C 143.732 22 150 28.268 150 36 L 150 100 L 122 100 L 122 36 C 122 28.268 128.268 22 136 22 Z"
            fill="url(#handGradient)" stroke="#3D2B1F" strokeWidth="2"/>
      {/* thumb */}
      <path d="M 140 123 L 171 123 C 179.285 123 186 129.715 186 138 C 186 146.285 179.285 153 171 153 L 140 153 L 140 123 Z"
            fill="url(#handGradient)" stroke="#3D2B1F" strokeWidth="2"/>

      {/* ring band on index finger */}
      <rect x="119" y="63" width="34" height="17" rx="8.5" fill="#C4893A" stroke="#9C6A28" strokeWidth="1.5"/>
      <rect x="119" y="65.9" width="34" height="4.76" rx="2.38" fill="#F0D9B0"/>
    </svg>
  )
}
