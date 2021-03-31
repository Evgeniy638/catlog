package com.copy.reddit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.xml.bind.DatatypeConverter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;

@Service
public class FileHelper {
    @Value("${app.path.upload.img}")
    private String pathUploadImg;

    public String saveDataUrlToFile(String dataUrl, String name) {
        String src = pathUploadImg + "\\" + name;

        File folder = new File(pathUploadImg);

        if (!folder.exists()) {
            folder.mkdir();
        }

        byte[] imageData = DatatypeConverter.parseBase64Binary(dataUrl.substring(dataUrl.indexOf(",") + 1));
        BufferedImage bufferedImage = null;
        try {
            bufferedImage = ImageIO.read(new ByteArrayInputStream(imageData));
            ImageIO.write(bufferedImage, "png", new File(src));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "img/" + name;
    }
}
