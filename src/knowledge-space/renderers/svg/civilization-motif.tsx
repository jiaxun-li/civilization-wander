import type { ReactNode } from 'react';

export type CivilizationMotifKind =
  | 'sphinx' | 'ziggurat' | 'indus-seal' | 'ding'
  | 'bull-horns' | 'lion-gate' | 'hittite-gate' | 'kerma-beaker'
  | 'lamassu' | 'ishtar-gate';

const paper = 'var(--ks-paper, #eee9dc)';

/** Original decorative abstractions, not reconstructions of archaeological objects. */
function motifDrawing(kind: CivilizationMotifKind): ReactNode {
  switch (kind) {
    case 'sphinx': return <>
      <path fill="currentColor" d="M 17 97 L 17 91 Q 20 86 28 86 L 60 86 L 67 63 L 60 57 L 56 45 L 48 43 L 48 38 L 43 36 L 49 28 L 49 20 Q 49 11 59 9 L 74 9 L 85 19 L 87 41 L 96 62 Q 124 54 158 60 Q 181 61 192 77 L 202 86 L 221 86 Q 229 87 229 97 Z" />
      <g fill="none" stroke={paper} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 70 15 L 72 34 L 64 52 L 75 65 L 68 87 L 36 91 M 79 18 L 84 42 L 76 58 M 59 19 L 51 21 M 52 30 L 58 30 M 51 41 L 58 41 M 96 68 Q 122 66 147 68 M 181 74 Q 164 70 158 80 L 174 89 L 212 91 M 77 89 L 145 89" />
        <path d="M 72 23 L 80 24 M 73 29 L 81 30 M 71 36 L 82 38 M 69 43 L 79 46 M 66 50 L 75 54" />
      </g>
      <path d="M 8 102 H 234" stroke="currentColor" strokeWidth="3" />
    </>;
    case 'ziggurat': return <>
      <path fill="currentColor" d="M 13 98 V 78 H 38 V 58 H 66 V 38 H 93 V 14 H 147 V 38 H 174 V 58 H 202 V 78 H 227 V 98 Z" />
      <g stroke={paper} strokeWidth="2.4" fill="none" strokeLinejoin="round">
        <path d="M 15 80 H 105 M 135 80 H 225 M 40 60 H 110 M 130 60 H 200 M 68 40 H 114 M 126 40 H 172 M 94 24 H 146" />
        <path d="M 99 98 L 115 38 H 125 L 141 98 M 111 55 H 129 M 109 64 H 131 M 106 74 H 134 M 103 85 H 137 M 101 94 H 139" />
      </g>
      <path fill={paper} d="M 115 27 H 125 V 38 H 115 Z" />
      <path d="M 7 103 H 233" stroke="currentColor" strokeWidth="3" />
    </>;
    case 'indus-seal': return <>
      <rect x="55" y="5" width="130" height="100" rx="5" fill="currentColor" />
      <rect x="61" y="11" width="118" height="88" rx="2" stroke={paper} strokeWidth="2" fill="none" />
      <path fill={paper} d="M 77 49 Q 92 45 115 47 Q 117 27 126 29 Q 133 30 134 45 L 143 43 L 154 39 L 164 47 L 163 56 L 152 58 L 146 69 L 141 70 L 144 88 H 139 L 133 69 L 105 68 L 98 87 H 93 L 97 65 L 88 62 L 85 87 H 80 L 82 59 L 78 55 Q 70 60 72 73 L 69 73 Q 65 55 77 49 Z" />
      <path d="M 148 42 Q 140 29 146 19 M 155 41 Q 166 29 158 20" fill="none" stroke={paper} strokeWidth="3" strokeLinecap="round" />
      <path d="M 126 45 L 128 62 M 145 48 L 150 52 M 88 57 Q 106 61 122 57" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="156" cy="48" r="1.7" fill="currentColor" />
    </>;
    case 'ding': return <>
      <g stroke="currentColor" strokeWidth="8" fill="none" strokeLinejoin="round">
        <path d="M 82 32 V 11 H 98 V 32 M 142 32 V 11 H 158 V 32" />
      </g>
      <path fill="currentColor" d="M 66 29 H 174 L 169 58 Q 165 75 150 80 L 157 102 H 143 L 136 83 H 126 V 104 H 114 V 83 H 104 L 97 102 H 83 L 90 80 Q 75 75 71 58 Z" />
      <g fill="none" stroke={paper} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M 74 38 H 166 M 76 46 H 164 M 120 47 V 76 M 83 53 H 103 V 62 H 92 V 58 M 157 53 H 137 V 62 H 148 V 58 M 85 69 Q 99 75 111 72 M 155 69 Q 141 75 129 72" />
      </g>
    </>;
    case 'bull-horns': return <>
      <path fill="currentColor" d="M 35 98 V 84 H 54 Q 32 53 37 9 Q 46 42 67 51 Q 81 58 85 73 H 155 Q 159 58 173 51 Q 194 42 203 9 Q 208 53 186 84 H 205 V 98 Z" />
      <path d="M 45 89 H 195 M 66 78 Q 67 66 54 48 M 174 78 Q 173 66 186 48" fill="none" stroke={paper} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 27 104 H 213" stroke="currentColor" strokeWidth="3" />
    </>;
    case 'lion-gate': return <>
      <path fill="currentColor" d="M 36 104 V 54 H 66 V 104 Z M 174 54 H 204 V 104 H 174 Z M 30 43 H 210 V 57 H 30 Z M 63 40 L 120 2 L 177 40 Z" />
      <path fill={paper} d="M 112 13 H 128 V 17 H 124 L 127 36 H 113 L 116 17 H 112 Z" />
      <path fill={paper} d="M 83 35 L 86 28 L 94 27 L 97 18 L 103 18 L 106 23 L 101 27 L 105 34 H 112 V 37 H 101 L 96 31 L 91 32 L 90 37 H 83 Z M 157 35 L 154 28 L 146 27 L 143 18 L 137 18 L 134 23 L 139 27 L 135 34 H 128 V 37 H 139 L 144 31 L 149 32 L 150 37 H 157 Z" />
      <g stroke={paper} strokeWidth="2.4" fill="none">
        <path d="M 37 73 H 65 M 37 89 H 65 M 175 73 H 203 M 175 89 H 203 M 39 50 H 201" />
      </g>
      <path d="M 26 106 H 214" stroke="currentColor" strokeWidth="3" />
    </>;
    case 'hittite-gate': return <>
      <path fill="currentColor" d="M 28 102 V 34 L 62 21 H 178 L 212 34 V 102 H 144 V 65 Q 120 38 96 65 V 102 Z" />
      <g fill="none" stroke={paper} strokeWidth="2.3" strokeLinejoin="round">
        <path d="M 31 49 H 74 L 87 28 M 166 49 H 209 M 152 27 L 166 49 M 32 78 H 66 M 174 78 H 208 M 50 34 V 49 M 190 34 V 49 M 45 80 V 101 M 195 80 V 101 M 98 28 V 42 M 142 28 V 42 M 101 45 H 139" />
        <path d="M 72 99 V 78 Q 61 68 66 56 Q 70 48 80 50 Q 91 50 92 61 Q 94 71 84 78 V 99 M 168 99 V 78 Q 179 68 174 56 Q 170 48 160 50 Q 149 50 148 61 Q 146 71 156 78 V 99" />
        <path d="M 70 60 L 76 63 M 86 60 L 81 63 M 75 69 L 79 72 L 83 69 M 170 60 L 164 63 M 154 60 L 159 63 M 165 69 L 161 72 L 157 69 M 73 89 H 83 M 157 89 H 167" />
      </g>
      <path d="M 20 106 H 220" stroke="currentColor" strokeWidth="3" />
    </>;
    case 'kerma-beaker': return <>
      <path fill="currentColor" d="M 77 16 Q 120 6 163 16 L 148 81 Q 144 102 120 103 Q 96 102 92 81 Z" />
      <ellipse cx="120" cy="16" rx="43" ry="8" fill="currentColor" />
      <ellipse cx="120" cy="16" rx="35" ry="4" fill={paper} />
      <path d="M 83 37 Q 120 44 157 37 M 86 45 Q 120 51 154 45 M 96 62 L 101 82 Q 103 91 111 94" fill="none" stroke={paper} strokeWidth="2.4" strokeLinecap="round" />
    </>;
    case 'lamassu': return <>
      <path fill="currentColor" d="M 42 95 L 46 71 L 41 55 L 42 39 L 33 34 L 41 26 V 14 L 49 14 V 7 H 65 V 14 H 73 L 75 37 L 84 57 L 106 58 Q 135 24 192 9 Q 176 40 163 60 Q 185 64 191 77 L 196 95 H 181 L 171 76 L 153 76 L 149 95 H 135 L 137 76 H 93 L 88 95 H 74 L 76 75 H 66 L 60 95 Z" />
      <g fill="none" stroke={paper} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 45 19 H 69 M 45 26 H 51 M 45 35 H 54 M 59 23 L 63 43 L 55 56 M 65 46 L 71 59 L 61 69 M 47 46 L 52 59 L 62 65 M 111 59 Q 140 39 177 23 M 122 61 L 167 32 M 137 61 L 159 45 M 84 65 H 137 M 167 69 Q 179 72 181 84" />
      </g>
      <path d="M 26 102 H 209" stroke="currentColor" strokeWidth="3" />
    </>;
    case 'ishtar-gate': return <>
      <path fill="currentColor" d="M 36 101 V 15 H 48 V 23 H 60 V 15 H 72 V 23 H 84 V 15 H 96 V 34 H 104 V 27 H 116 V 34 H 124 V 27 H 136 V 34 H 144 V 15 H 156 V 23 H 168 V 15 H 180 V 23 H 192 V 15 H 204 V 101 H 139 V 71 A 19 19 0 0 0 101 71 V 101 Z" />
      <g stroke={paper} strokeWidth="2.4" fill="none" strokeLinejoin="round">
        <path d="M 39 31 H 93 M 147 31 H 201 M 39 95 H 93 M 147 95 H 201 M 93 100 V 71 A 27 27 0 0 1 147 71 V 100 M 40 41 H 89 M 151 41 H 200" />
        <path d="M 53 55 H 70 L 77 62 H 62 L 58 68 M 55 60 L 52 68 M 56 80 H 73 L 80 87 H 65 L 61 92 M 58 85 L 55 92 M 187 55 H 170 L 163 62 H 178 L 182 68 M 185 60 L 188 68 M 184 80 H 167 L 160 87 H 175 L 179 92 M 182 85 L 185 92" />
      </g>
      <path d="M 26 106 H 214" stroke="currentColor" strokeWidth="3" />
    </>;
  }
}

export function CivilizationMotif({ kind }: { readonly kind: CivilizationMotifKind }): ReactNode {
  return <svg className="ks-civilization-backdrop__motif" viewBox="0 0 240 110" aria-hidden="true" data-civilization-motif={kind}>
    {motifDrawing(kind)}
  </svg>;
}
