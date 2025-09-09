        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-VNG605KE2R');
        // Current selections
        
        // Переменная для отслеживания состояния кнопки
        let isOrderProcessing = false;
        
        let currentSelections = {
            picture: 'empty',
            color: 'black',
            thickness: 'thin',
            shape: 'rectangle'
        };
        
        // Debug function to log current selections
        function debugSelections() {
            console.log('Current selections:', currentSelections);
        }
        
        // Update order button price - fixed price for 6250-7
        function updateOrderButton() {
            const button = document.getElementById('orderButton');
            button.textContent = `Заказать за 199 ₽`;
        }
        
        // Simple sticker update without caching
        function updateStickerPreview() {
            const preview = document.getElementById('stickerPreview');
            const customText = document.getElementById('customText');
            
            // Show/hide custom text based on selection
            if (currentSelections.picture === 'own') {
                customText.style.display = 'block';
            } else {
                customText.style.display = 'none';
            }
            
            // Map UI values to classification values
            const pictureMap = {
                'empty': 'empty',
                'cat': 'cat',
                'robocat': 'robot-cat',
                'smile': 'smile-hearts',
                'cookie': 'gingerbread',
                'slider': 'slider-smile',
                'donut': 'donut',
                'own': 'custom'
            };
            
            const mappedPicture = pictureMap[currentSelections.picture] || 'empty';
            
            // Find sticker based on all 4 parameters
            let sticker = findStickerByParams(
                mappedPicture,
                currentSelections.color,
                currentSelections.thickness,
                currentSelections.shape
            );
            
            // If no exact match, try to find by picture only
            if (!sticker) {
                for (let i = 1; i <= 880; i++) {
                    const classification = getStickerClassification(i);
                    if (classification && classification.design === mappedPicture) {
                        sticker = classification;
                        break;
                    }
                }
            }
            
            if (sticker) {
                const imageSrc = `images/${sticker.filename}`;
                preview.innerHTML = `<img src="${imageSrc}" alt="Стикер ${sticker.number}" style="width: 100%; height: 100%; object-fit: contain;">`;
                positionSticker(preview, currentSelections.shape);
            } else {
                preview.innerHTML = '';
            }
        }

        // Sticker classification system
        function getStickerClassification(stickerNumber) {
            if (stickerNumber < 1 || stickerNumber > 880) {
                return null;
            }
            
            const decade = Math.ceil(stickerNumber / 10);
            const position = stickerNumber % 10 || 10;
            
            const designColorMap = {
                1: { design: 'empty', color: 'red' },
                2: { design: 'cat', color: 'red' },
                3: { design: 'slider-smile', color: 'red' },
                4: { design: 'robot-cat', color: 'red' },
                5: { design: 'smile-hearts', color: 'red' },
                6: { design: 'smile-hearts', color: 'green' },
                7: { design: 'robot-cat', color: 'green' },
                8: { design: 'slider-smile', color: 'green' },
                9: { design: 'cat', color: 'green' },
                10: { design: 'custom', color: 'red' },
                11: { design: 'custom', color: 'green' },
                12: { design: 'gingerbread', color: 'red' },
                13: { design: 'donut', color: 'red' },
                14: { design: 'ribbon', color: 'green' },
                15: { design: 'gingerbread', color: 'green' },
                16: { design: 'donut', color: 'green' },
                17: { design: 'empty', color: 'green' },
                18: { design: 'empty', color: 'gradient' },
                19: { design: 'slider-smile', color: 'gradient' },
                20: { design: 'smile-hearts', color: 'gradient' },
                21: { design: 'custom', color: 'gradient' },
                22: { design: 'gingerbread', color: 'gradient' },
                23: { design: 'donut', color: 'gradient' },
                24: { design: 'ribbon', color: 'gradient' },
                25: { design: 'cat', color: 'gradient' },
                26: { design: 'ribbon', color: 'red' },
                27: { design: 'empty', color: 'white' },
                28: { design: 'empty', color: 'black' },
                29: { design: 'slider-smile', color: 'white' },
                30: { design: 'cat', color: 'white' },
                31: { design: 'slider-smile', color: 'black' },
                32: { design: 'smile-hearts', color: 'white' },
                33: { design: 'robot-cat', color: 'white' },
                34: { design: 'custom', color: 'white' },
                35: { design: 'gingerbread', color: 'white' },
                36: { design: 'donut', color: 'white' },
                37: { design: 'ribbon', color: 'white' },
                38: { design: 'smile-hearts', color: 'black' },
                39: { design: 'cat', color: 'black' },
                40: { design: 'robot-cat', color: 'black' },
                41: { design: 'custom', color: 'black' },
                42: { design: 'gingerbread', color: 'black' },
                43: { design: 'donut', color: 'black' },
                44: { design: 'ribbon', color: 'black' }
            };
            
            const shapeThicknessMap = {
                1: { shape: 'small-rectangle', thickness: 'thick' },
                2: { shape: 'square', thickness: 'thick' },
                3: { shape: 'rectangle', thickness: 'thick' },
                4: { shape: 'cutout', thickness: 'thick' },
                5: { shape: 'cutout', thickness: 'thin' },
                6: { shape: 'circle', thickness: 'thick' },
                7: { shape: 'circle', thickness: 'thin' },
                8: { shape: 'small-rectangle', thickness: 'thin' },
                9: { shape: 'square', thickness: 'thin' },
                10: { shape: 'rectangle', thickness: 'thin' }
            };
            
            const designColor = designColorMap[decade];
            const shapeThickness = shapeThicknessMap[position];
            
            // Debug logging for position 10
            if (position === 10) {
                        console.log('Carousel clicked:', carouselId, 'Value:', value);
                        
                        if (carouselId === 'pictureCarousel') {
                            currentSelections.picture = value;
                        } else if (carouselId === 'colorCarousel') {
                            currentSelections.color = value;
                        } else if (carouselId === 'thicknessCarousel') {
                            currentSelections.thickness = value;
                        } else if (carouselId === 'shapeCarousel') {
                            currentSelections.shape = value;
                        }
                        
                        console.log('Updated selections:', currentSelections);
                        
                        // Always update sticker preview when any parameter changes
                        updateStickerPreview();
                        
                        // Update order button price
                        updateOrderButton();
                    }
        // Update only sticker position
        function updateStickerPosition() {
            const preview = document.getElementById('stickerPreview');
            if (preview && preview.innerHTML) {
                positionSticker(preview, currentSelections.shape);
            }
        }

        // Position sticker on iPhone based on shape
        function positionSticker(preview, shape) {
            const positions = {
                'rectangle': { top: '75%', left: '50%', transform: 'translate(-50%, -50%)', width: '280px', height: '80px' },
                'square': { top: '75%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px' },
                'circle': { top: '75%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px' },
                'small-rectangle': { top: '15%', left: '75%', transform: 'translate(-50%, -50%)', width: '300px', height: '80px' },
                'cutout': { top: '80%', left: '50%', transform: 'translate(-50%, -50%)', width: '350px', height: '110px' }
            };
            
            const position = positions[shape] || positions['rectangle'];
            Object.assign(preview.style, position);
        }

        // Navigation functions
        function goBack() {
            window.location.href = 'landing.html';
        }
        
        // Функция для обработки выбора дизайна
        
        // Функция для обработки выбора дизайна с защитой от повторных нажатий
        async function selectDesign() {
            if (isOrderProcessing) {
                console.log('Заказ уже обрабатывается, повторное нажатие игнорируется');
                return;
            }
            
            isOrderProcessing = true;
            const orderButton = document.getElementById('orderButton');
            
            try {
                console.log('Начинаем процесс заказа...');
                orderButton.disabled = true;
                orderButton.style.backgroundColor = '#898991';
                orderButton.style.cursor = 'not-allowed';
                
                const userData = collectUserData();
                const success = await sendDataToGoogleSheets(userData);
                
                if (success) {
                    console.log('Данные успешно отправлены, перенаправляем...');
                    window.location.href = 'thank-you.html';
                } else {
                    console.error('Произошла ошибка при сохранении данных, но заказ принят!');
                    window.location.href = 'thank-you.html';
                }
            } catch (error) {
                console.error('Ошибка в процессе заказа:', error);
                window.location.href = 'thank-you.html';
            }
            // Не сбрасываем флаг isOrderProcessing, чтобы кнопка оставалась заблокированной
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            initCarousels();
            updateStickerPreview();
            updateOrderButton();
        // Отправляем событие просмотра конструктора только при первом рендере
        let constructorViewed = false;
        if (!constructorViewed) {
            constructorViewed = true;
            gtag('event', '6250_page_view_constructor_var7');
            ym(96171108, 'reachGoal', '6250_page_view_constructor_var7');
        }
        
        // Отслеживаем клик на кнопку "Заказать за Х р"
        document.addEventListener('DOMContentLoaded', function() {
            const orderBtn = document.getElementById('orderButton');
            if (orderBtn) {
                orderBtn.addEventListener('click', function() {
                    gtag('event', '6250_click_buy_var7');
                    ym(96171108, 'reachGoal', '6250_click_buy_var7');
                });
            }
